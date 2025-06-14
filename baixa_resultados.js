const fs = require('fs');
const http = require('http');
const https = require('https');

/**
 * Faz o download do arquivo Excel com os resultados da Mega-Sena
 * diretamente da API oficial da Caixa Econômica Federal
 * @param {string} url - URL para download
 * @param {number} maxRedirects - Número máximo de redirecionamentos (padrão: 5)
 */
function baixarMegaSena(url = null, maxRedirects = 5) {
    // Tenta primeiro com HTTPS, depois HTTP se necessário
    const urlPrincipal = url || 'https://servicebus2.caixa.gov.br/portaldeloterias/api/resultados/download?modalidade=Mega-Sena';
    const nomeArquivo = 'mega-sena.xlsx';
    
    console.log('🔄 Iniciando download dos resultados da Mega-Sena...');
    console.log(`📡 URL: ${urlPrincipal}`);
    
    // Determina se usa HTTP ou HTTPS baseado na URL
    const client = urlPrincipal.startsWith('https:') ? https : http;
    
    console.log('🔄 Iniciando download dos resultados da Mega-Sena...');
    console.log(`📡 URL: ${urlPrincipal}`);
    
   
    // Cria stream de escrita para o arquivo
    const arquivo = fs.createWriteStream(nomeArquivo);
    
    // Faz a requisição HTTP/HTTPS
    client.get(urlPrincipal, (response) => {
        // Verifica se é um redirecionamento (301, 302, 307, 308)
        if ([301, 302, 307, 308].includes(response.statusCode)) {
            const novaUrl = response.headers.location;
            
            if (!novaUrl) {
                console.error('❌ Redirecionamento sem URL de destino');
                arquivo.destroy();
                return;
            }
            
            if (maxRedirects <= 0) {
                console.error('❌ Muitos redirecionamentos');
                arquivo.destroy();
                return;
            }
            
            console.log(`🔄 Redirecionando para: ${novaUrl}`);
            arquivo.destroy();
            
            // Chama recursivamente com a nova URL
            baixarMegaSena(novaUrl, maxRedirects - 1);
            return;
        }
        
        // Verifica se a resposta foi bem-sucedida
        if (response.statusCode !== 200) {
            console.error(`❌ Erro na requisição: Status ${response.statusCode}`);
            arquivo.destroy();
            return;
        }
        
        console.log('📥 Recebendo dados...');
        
        // Conecta a resposta ao arquivo
        response.pipe(arquivo);
        
        // Evento disparado quando o download é concluído
        arquivo.on('finish', () => {
            arquivo.close((err) => {
                if (err) {
                    console.error('❌ Erro ao fechar arquivo:', err.message);
                    return;
                }
                console.log(`✅ Arquivo '${nomeArquivo}' baixado com sucesso!`);
            });
        });
        
        // Tratamento de erro no arquivo
        arquivo.on('error', (err) => {
            console.error('❌ Erro ao escrever arquivo:', err.message);
            fs.unlink(nomeArquivo, () => {}); // Remove arquivo corrompido
        });
        
    }).on('error', (err) => {
        console.error('❌ Erro na requisição HTTP:', err.message);
        
        // Remove arquivo parcial em caso de erro
        fs.unlink(nomeArquivo, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                console.error('❌ Erro ao remover arquivo parcial:', unlinkErr.message);
            }
        });
    });
}

// Executa o download - tenta primeiro HTTPS, depois HTTP se der erro
baixarMegaSena();