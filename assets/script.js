const baseUrl = "http://localhost:3000";
let listaDePaleta = [];

const listarTodasAsPaletas = async () => {
  const resposta = await fetch(`${baseUrl}/paletas/listar-todas`);
  const paletas = await resposta.json();

  listaDePaleta = paletas

  return paletas;
}

const buscarPaletaId = async (id) => {
  const resposta = await fetch(`${baseUrl}/paletas/paleta/${id}`);

  if (resposta.status === 404) {
    return false;
  }

  const paleta = await resposta.json();

  return paleta;
}

const criarPaleta = async (sabor, descricao, foto, preco) => {
  const paleta = {
    sabor,
    descricao,
    foto,
    preco
  };

  const resposta = await fetch(`${baseUrl}/paletas/criar-paleta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors",
    body: JSON.stringify(paleta)
  });
  const paletaCriada = await resposta.json();

  return paletaCriada;
}

const atualizarPaleta = async (id, sabor, descricao, foto, preco) => {
  const paleta = {
    sabor,
    descricao,
    foto,
    preco
  };

  const resposta = await fetch(`${baseUrl}/paletas/atualizar-paleta/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors",
    body: JSON.stringify(paleta)
  });
  const paletaAtualizada = await resposta.json();

  return paletaAtualizada;
}

const deletarPaleta = async (id) => {
  const resposta = await fetch(`${baseUrl}/paletas/excluir-paleta/${id}`, {
    method: "DELETE",
    mode: "cors"
  });
    
  if (resposta.status === 204) {
    return "Paleta excluída com sucesso!";
  } else {
    return "Paleta não encontrada!";
  }
}

// html:

const imprimirTodasPaletas = async () => {
  const paletas = await listarTodasAsPaletas();

  paletas.forEach((paleta) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
          <h4>${paleta.sabor}</h4>
          <span>R$${paleta.preco.toFixed(2)}</span>
          <p>${paleta.descricao}</p>
        </div>
        <img src="./${paleta.foto}" alt="Paleta sabor ${paleta.sabor}" class="CartaoPaleta__foto"/>
      </div>
      `
    );
  });
}

imprimirTodasPaletas();

const imprimirUmaPaletaPorId = async () => {
  document.getElementById("paletaPesquisada").innerHTML = "";
  const input = document.getElementById("InputBuscaSaborPaleta"); 
  const sabor = input.value;

  const paletaSelecionada = listaDePaleta.find((paleta) => paleta.sabor === sabor);

  if (paletaSelecionada === undefined) {
    const mensagemDeErro = document.createElement("p");
    mensagemDeErro.id = "mensagemDeErro";
    mensagemDeErro.classList.add("MensagemDeErro");
    mensagemDeErro.innerText = "Nenhuma paleta encontrada!";

    document.getElementById("paletaPesquisada").appendChild(mensagemDeErro);

  }

  const id = paletaSelecionada._id;
  const paletaPesquisa = await buscarPaletaId(id);

  if (paletaPesquisa === false) {
    const mensagemDeErro = document.createElement("p");
    mensagemDeErro.id = "mensagemDeErro";
    mensagemDeErro.classList.add("MensagemDeErro");
    mensagemDeErro.innerText = "Nenhuma paleta encontrada!";

    document.getElementById("paletaPesquisada").appendChild(mensagemDeErro);

    return;
  }else {
    document.getElementById("paletaPesquisada").innerHTML = `
    <div class="CartaoPaleta">
      <div class="CartaoPaleta__infos">
        <h4>${paletaPesquisa.sabor}</h4>
        <span>R$${paletaPesquisa.preco.toFixed(2)}</span>
        <p>${paletaPesquisa.descricao}</p>
      </div>
      <img src="./${paletaPesquisa.foto}" alt="Paleta sabor ${paletaPesquisa.sabor}" class="CartaoPaleta__foto"/>
    </div>
    `;
  }
}

const mostrarModalCriacao = () => {
  document.getElementById("fundoModal").style.display = "flex";
}

const esconderModalCriacao = () => {
  document.getElementById("inputSabor").value = "";
  document.getElementById("inputPreco").value = "";
  document.getElementById("inputDescricao").value = "";
  document.getElementById("inputFoto").value = "";

  document.getElementById("fundoModal").style.display = "none";
}

const cadastrarNovaPaleta = async () => {
  const sabor = document.getElementById("inputSabor").value;
  const preco = document.getElementById("inputPreco").value;
  const descricao = document.getElementById("inputDescricao").value;
  const foto = document.getElementById("inputFoto").value;

  const paleta = await criarPaleta(sabor, descricao, foto, preco);

  document.getElementById("paletaList").insertAdjacentHTML(
    "beforeend",
    `
    <div class="CartaoPaleta">
      <div class="CartaoPaleta__infos">
        <h4>${paleta.sabor}</h4>
        <span>R$${paleta.preco.toFixed(2)}</span>
        <p>${paleta.descricao}</p>
      </div>
      <img src="./${paleta.foto}" alt="Paleta sabor ${paleta.sabor}" class="CartaoPaleta__foto"/>
    </div>
    `
  );

  esconderModalCriacao();
}