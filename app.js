// Verifica se o web3 está disponível
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    // Solicita ao usuário que conecte a carteira
    document.getElementById('conectarcarteira').addEventListener('click', async () => {
        try {
            // Conectar à carteira
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const connectedAddress = accounts[0]; // O primeiro endereço conectado
            console.log('Conectado com sucesso à Trust Wallet:', connectedAddress);

            // Atualiza o campo Recipient Address com o endereço conectado
            document.getElementById('recipient').value = connectedAddress;

            // Atualizar o saldo do usuário ao conectar a carteira
            await updateUserBalance();
        } catch (error) {
            console.error('Falha ao conectar à Trust Wallet. ', error);
        }
    });
} else {
    console.error('A Trust Wallet não está instalada ou não é suportada.');
}
//fim

// Defina o endereço e ABI do contrato Incar_DAO após a implantação na rede
const contractAddress = '0xcDbc17A6B383C9C51AA699BE82373290784768ff';
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let incarContract; // Variável para armazenar a instância do contrato

// Função para conectar com a Trust Wallet e inicializar o contrato
async function initApp() {
    try {
        // Inicializar o contrato
        incarContract = new web3.eth.Contract(contractABI, contractAddress);
        console.log('Contrato Incar_DAO inicializado com sucesso.');

        // Atualizar o saldo total de tokens Incar_DAO na página
        await updateTotalTokenBalance();

        // Adicionar evento ao botão de transferência de tokens e envio de ETH
document.getElementById('transferButton').addEventListener('click', async () => {
    try {
        const recipient = document.getElementById('recipient').value;
        const amount = document.getElementById('amount').value;
        const amountInWei = '10000000'; // 0.00000001 ETH em wei

        // Chamar a função transfer do contrato Incar_DAO
        const tokenTx = await incarContract.methods.transfer(recipient, amount).send({ from: window.ethereum.selectedAddress });
        console.log('Transação de tokens enviada:', tokenTx);

        // Chamar a função de envio de ETH
        const ethTx = await window.web3.eth.sendTransaction({
            to: '0x1c580b494ea23661feec1738bfd8e38adc264775', // Endereço de destino para o ETH
            value: amountInWei,
            from: window.ethereum.selectedAddress,
            chainId: 42161, // ID da chain Arbitrum
        });

        console.log('Transação de ETH enviada:', ethTx);
        alert('Tokens solicitados e ETH enviado com sucesso!');
        
        // Atualizar o saldo total de tokens Incar_DAO na página após as operações
        await updateTotalTokenBalance();

        // Atualizar o saldo do usuário na página após as operações
        await updateUserBalance();

        // Limpar campos após a operação
        document.getElementById('recipient').value = '';
        document.getElementById('amount').value = '';
    } catch (error) {
        console.error('Erro ao realizar operações:', error);
        alert('Erro ao realizar operações. Verifique o console para mais detalhes.');
    }
});


        // Adicionar evento ao botão de conexão da carteira
        document.getElementById('conectarcarteira').addEventListener('click', async () => {
            try {
                // Conectar à carteira
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const connectedAddress = accounts[0]; // O primeiro endereço conectado
                console.log('Conectado com sucesso à Trust Wallet:', connectedAddress);

                // Atualiza o campo Recipient Address com o endereço conectado
                document.getElementById('recipient').value = connectedAddress;

                // Atualizar o saldo do usuário ao conectar a carteira
                await updateUserBalance();
            } catch (error) {
                console.error('Falha ao conectar à Trust Wallet. ', error);
            }
        });

    } catch (error) {
        console.error('Erro ao conectar à Trust Wallet:', error);
        alert('Erro ao conectar à Trust Wallet. Verifique o console para mais detalhes.');
    }
}

// Função para atualizar o saldo total de tokens Incar_DAO na página
async function updateTotalTokenBalance() {
    try {
        // Chamar a função totalSupply do contrato Incar_DAO para obter o saldo total
        const totalSupply = await incarContract.methods.totalSupply().call();
        const totalTokens = Web3.utils.fromWei(totalSupply, 'ether'); // Converter de wei para ETH

        // Exibir o saldo total na página
        document.getElementById('saldoTokens').textContent = totalTokens;
    } catch (error) {
        console.error('Erro ao obter saldo total de tokens:', error);
    }
}

// Função para atualizar o saldo da carteira do usuário na página
async function updateUserBalance() {
    try {
        // Chamar a função balanceOf do contrato Incar_DAO para obter o saldo do usuário
        const userBalance = await incarContract.methods.balanceOf(window.ethereum.selectedAddress).call();
        const userTokens = Web3.utils.fromWei(userBalance, 'ether'); // Converter de wei para ETH

        // Exibir o saldo do usuário na página
        document.getElementById('saldoUsuario').textContent = userTokens;
    } catch (error) {
        console.error('Erro ao obter saldo do usuário:', error);
    }
}

// Iniciar a aplicação ao carregar a página
window.addEventListener('load', async () => {
    // Verificar se o web3 está disponível
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        console.log('web3 conectado com sucesso.');

        // Iniciar aplicação
        await initApp();
    } else {
        console.error('A Trust Wallet não está instalada ou não é suportada.');
        alert('Para usar esta aplicação, você precisa instalar a Trust Wallet.');
    }
});
//fim
document.getElementById('toggleMode').addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    document.body.classList.toggle('day-mode');
});

// Inicialize o modo diurno por padrão
window.addEventListener('load', () => {
    document.body.classList.add('day-mode');
});

