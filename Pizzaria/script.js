// Adicionar pizza/combo ao carrinho
function adicionarCarrinho(nome, preco, img=null){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Pega a imagem se não passou
    if(!img){
        const itemDiv = Array.from(document.getElementsByClassName('item'))
            .find(div => div.dataset.nome === nome);
        img = itemDiv.querySelector('img').src;
    }

    // Verifica se já existe no carrinho
    let existe = carrinho.find(i => i.nome === nome);
    if(existe){
        existe.qtd +=1;
    } else {
        carrinho.push({nome, preco, img: img, qtd: 1});
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${nome} adicionado ao carrinho!`);
}

// Mostrar carrinho
function mostrarCarrinho(){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let container = document.getElementById('carrinho-container');
    container.innerHTML = '';
    let total = 0;

    if(carrinho.length === 0){
        container.innerHTML = '<p style="text-align:center;font-size:18px;">Carrinho vazio</p>';
        return;
    }

    carrinho.forEach((item, index)=>{
        total += item.preco * item.qtd;
        container.innerHTML += `
        <div class="item-carrinho" style="display:flex;align-items:center;margin-bottom:15px;background:#222;padding:10px;border-radius:10px;">
            <img src="${item.img}" alt="${item.nome}" style="width:80px;height:80px;border-radius:8px;margin-right:15px;">
            <div style="flex:1;">
                <h3>${item.nome}</h3>
                <span>R$ ${item.preco.toFixed(2)} x ${item.qtd}</span>
            </div>
            <div>
                <button onclick="alterarQtd(${index}, -1)">-</button>
                <button onclick="alterarQtd(${index}, 1)">+</button>
                <button onclick="removerItem(${index})">Remover</button>
            </div>
        </div>`;
    });

    container.innerHTML += `<h3 style="text-align:center;margin-top:20px;">Total: R$ ${total.toFixed(2)}</h3>`;
}

// Alterar quantidade de um item
function alterarQtd(index, delta){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if(!carrinho[index]) return; // protege contra index inválido

    carrinho[index].qtd += delta;
    if(carrinho[index].qtd <= 0){
        carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
}

// Remover item do carrinho
function removerItem(index){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if(!carrinho[index]) return;

    carrinho.splice(index,1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
}

// Finalizar pedido via WhatsApp
function finalizarPedido(){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if(carrinho.length === 0){
        alert('Carrinho vazio!');
        return;
    }

    let msg = 'Olá! Quero fazer o pedido:%0A';
    let total = 0;

    carrinho.forEach(item=>{
        msg += `• ${item.nome} x ${item.qtd} — R$ ${(item.preco*item.qtd).toFixed(2)}%0A`;
        total += item.preco * item.qtd;
    });

    msg += `Total: R$ ${total.toFixed(2)}`;
    const phone = '5562991606500'; // SEU NÚMERO
    window.open(`https://wa.me/${phone}?text=${msg}`);
}

// Carregar carrinho ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('carrinho-container')){
        mostrarCarrinho();
    }
});
