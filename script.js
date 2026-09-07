// Seleção dos elementos principais do HTML.
// Esses elementos serão usados para ler os dados digitados e atualizar a tela.
const form = document.querySelector("#formMovimentacao");
const campoId = document.querySelector("#movimentacaoId");
const campoDescricao = document.querySelector("#descricao");
const campoValor = document.querySelector("#valor");
const campoTipo = document.querySelector("#tipo");
const campoData = document.querySelector("#data");
const campoCategoria = document.querySelector("#categoria");
const campoMeioPagamento = document.querySelector("#meioPagamento");
const campoParcelasWrapper = document.querySelector("#campoParcelasWrapper");
const campoParcelas = document.querySelector("#parcelas");

const btnSalvar = document.querySelector("#btnSalvar");
const btnCancelar = document.querySelector("#btnCancelar");

const listaMovimentacoes = document.querySelector("#listaMovimentacoes");
const listaFatura = document.querySelector("#listaFatura");
const textoFiltro = document.querySelector("#textoFiltro");

const botoesFiltroTipo =
    document.querySelectorAll(".filtros-tipo .filtro:not(#filtrosPeriodoPagina1 .filtro, #filtrosPeriodoFatura .filtro)");
const botoesPeriodoPagina1 =
    document.querySelectorAll("#filtrosPeriodoPagina1 .filtro");
const filtroCategoria =
    document.querySelector("#filtroCategoria");
const filtroMeioPagamento =
    document.querySelector("#filtroMeioPagamento");
const filtroDataInicio =
    document.querySelector("#filtroDataInicio");
const filtroDataFim =
    document.querySelector("#filtroDataFim");
const btnLimparFiltros =
    document.querySelector("#btnLimparFiltros");

const saldoAtual =
    document.querySelector("#saldoAtual");
const totalEntradas =
    document.querySelector("#totalEntradas");
const totalSaidas =
    document.querySelector("#totalSaidas");
const totalFaturaCredito =
    document.querySelector("#totalFaturaCredito");

const abasBtns =
    document.querySelectorAll(".aba-btn");
const conteudosAbas =
    document.querySelectorAll(".conteudo-aba");

const formCategoria =
    document.querySelector("#formCategoria");
const tituloFormCategoria =
    document.querySelector("#tituloFormCategoria");
const nomeNovaCategoria =
    document.querySelector("#nomeNovaCategoria");
const categoriaIndexEdicao =
    document.querySelector("#categoriaIndexEdicao");
const btnSalvarCategoria =
    document.querySelector("#btnSalvarCategoria");
const btnCancelarCategoria =
    document.querySelector("#btnCancelarCategoria");
const listaCategorias =
    document.querySelector("#listaCategorias");

const botoesPeriodoFatura =
    document.querySelectorAll("#filtrosPeriodoFatura .filtro");
const filtroMesAnoFatura =
    document.querySelector("#filtroMesAnoFatura");

// Dados principais da aplicação.
// Primeiro tentamos carregar do localStorage; se não existir nada salvo, usamos valores iniciais.
let movimentacoes =
    JSON.parse(localStorage.getItem("movimentacoes")) || [];

let categorias =
    JSON.parse(localStorage.getItem("categorias")) || [
        "Alimentação",
        "Moradia",
        "Transporte",
        "Lazer",
        "Salário",
        "Outros"
    ];

let filtroTipoAtual = "todas";
let filtroPeriodoMesesPagina1 = 0;
let filtroCategoriaAtual = "todas";
let filtroMeioPagamentoAtual = "todas";
let filtroDataInicioAtual = "";
let filtroDataFimAtual = "";

let mesesFaturaSelecionados = 0;
let filtroMesAnoFaturaEspecifico = "";

// Formata números para o padrão de moeda brasileira.
function formatarMoeda(valor) {
    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function paraISO(data) {
    return data.toISOString().split("T")[0];
}

// Normaliza textos para comparar categorias sem diferenciar maiúsculas, minúsculas ou acentos.
function normalizarTexto(texto) {
    return texto
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


function converterValorParaNumero(valorStr) {
    if (typeof valorStr !== "string") {
        valorStr = String(valorStr);
    }

    let limpo = valorStr
        .replace(/\./g, "")
        .replace(",", ".");

    return parseFloat(limpo) || 0;
}

// Mostra o nome legível do meio de pagamento salvo no objeto.
function nomeMeioPagamento(meio) {
    const nomes = {
        credito: "Crédito",
        debito: "Débito",
        pix: "Pix",
        boleto: "Boleto",
        dinheiro: "Dinheiro",
        transferencia: "Transferência",
        deposito: "Depósito",
        outros: "Outros"
    };

    return nomes[meio] || meio;
}

// Máscara do campo de valor: enquanto digita, o número já fica no formato 0,00.
campoValor.addEventListener("input", (e) => {
    let digits =
        e.target.value.replace(/\D/g, "");

    if (digits === "") {
        digits = "0";
    }

    let numero =
        parseInt(digits, 10) / 100;

    e.target.value =
        numero.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
});

// Soma meses sem quebrar datas como dia 31 em meses menores.
// Usada principalmente para distribuir compras parceladas.
function adicionarMesSeguro(data, quantidadeMeses) {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();

    const novaData =
        new Date(
            ano,
            mes + quantidadeMeses,
            1
        );

    const ultimoDia =
        new Date(
            novaData.getFullYear(),
            novaData.getMonth() + 1,
            0
        ).getDate();

    novaData.setDate(
        Math.min(dia, ultimoDia)
    );

    return novaData;
}

// Controle das abas: remove a aba ativa atual e mostra a aba clicada.
abasBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        abasBtns.forEach(b =>
            b.classList.remove("ativo")
        );

        conteudosAbas.forEach(c =>
            c.classList.remove("ativo")
        );

        btn.classList.add("ativo");

        const abaId =
            btn.getAttribute("data-aba");

        if (abaId === "movimentacoes") {
            document
                .querySelector("#abaMovimentacoes")
                .classList.add("ativo");
        }

        if (abaId === "categorias") {
            document
                .querySelector("#abaCategorias")
                .classList.add("ativo");
        }

        if (abaId === "fatura") {
            document
                .querySelector("#abaFatura")
                .classList.add("ativo");
        }
    });
});

// Atualiza os meios de pagamento disponíveis conforme o tipo da movimentação.
// Entradas e saídas possuem opções diferentes.
function atualizarMeiosPagamento(valorSelecionado = "") {
    if (!campoMeioPagamento) {
        return;
    }

    const tipo = campoTipo.value;

    campoMeioPagamento.innerHTML = `
        <option value="" disabled selected>
            Selecione
        </option>
    `;

    if (tipo === "entrada") {
        campoMeioPagamento.innerHTML += `
            <option value="pix">Pix</option>
            <option value="transferencia">Transferência</option>
            <option value="deposito">Depósito</option>
            <option value="outros">Outros</option>
        `;
    }

    if (tipo === "saida") {
        campoMeioPagamento.innerHTML += `
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="pix">Pix</option>
            <option value="boleto">Boleto</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="transferencia">Transferência</option>
            <option value="outros">Outros</option>
        `;
    }

    if (valorSelecionado) {
        const existe =
            Array.from(
                campoMeioPagamento.options
            ).some(
                option =>
                    option.value === valorSelecionado
            );

        if (existe) {
            campoMeioPagamento.value =
                valorSelecionado;
        }
    }

    verificarExibicaoParcelas();
}

// O campo de parcelas só aparece quando for saída no crédito.
function verificarExibicaoParcelas() {
    if (
        campoTipo.value === "saida" &&
        campoMeioPagamento.value === "credito"
    ) {
        campoParcelasWrapper.style.display =
            "flex";
    } else {
        campoParcelasWrapper.style.display =
            "none";

        if (campoParcelas) {
            campoParcelas.value = 1;
        }
    }
}

campoTipo.addEventListener(
    "change",
    () => {
        atualizarMeiosPagamento();
    }
);

campoMeioPagamento.addEventListener(
    "change",
    verificarExibicaoParcelas
);

// Preenche os selects de categoria no formulário e nos filtros.
function atualizarSelectsCategorias() {
    [campoCategoria, filtroCategoria]
        .forEach(select => {
            if (!select) {
                return;
            }

            const valorAtual =
                select.value;

            select.innerHTML =
                select === filtroCategoria
                    ? '<option value="todas">Todas</option>'
                    : '<option value="" disabled selected>Selecione</option>';

            categorias.forEach(cat => {
                const opt =
                    document.createElement("option");

                opt.value = cat;
                opt.textContent = cat;

                select.appendChild(opt);
            });

            if (
                Array.from(select.options)
                    .some(
                        option =>
                            option.value === valorAtual
                    )
            ) {
                select.value = valorAtual;
            }
        });

    localStorage.setItem(
        "categorias",
        JSON.stringify(categorias)
    );
}

// Cadastro e edição de categorias personalizadas.
formCategoria.addEventListener(
    "submit",
    (e) => {
        e.preventDefault();

        const nome =
            nomeNovaCategoria.value.trim();

        const indiceEdicao =
            categoriaIndexEdicao.value;

        if (!nome) {
            return;
        }

        const nomeNormalizado =
            normalizarTexto(nome);

        const duplicada =
            categorias.some(
                (cat, idx) => {
                    if (
                        indiceEdicao !== "" &&
                        Number(indiceEdicao) === idx
                    ) {
                        return false;
                    }

                    return (
                        normalizarTexto(cat) ===
                        nomeNormalizado
                    );
                }
            );

        if (duplicada) {
            alert(
                "Este nome de categoria já existe."
            );
            return;
        }

        if (indiceEdicao !== "") {
            const index =
                Number(indiceEdicao);

            const categoriaAntiga =
                categorias[index];

            categorias[index] =
                nome;

            movimentacoes.forEach(m => {
                if (
                    m.categoria ===
                    categoriaAntiga
                ) {
                    m.categoria = nome;
                }
            });

            localStorage.setItem(
                "movimentacoes",
                JSON.stringify(movimentacoes)
            );

            limparFormularioCategoria();
        } else {
            categorias.push(nome);
            nomeNovaCategoria.value = "";
        }

        atualizarSelectsCategorias();
        renderizarCategorias();
        renderizarTela();
    }
);

// Monta a lista visual das categorias cadastradas.
function renderizarCategorias() {
    if (!listaCategorias) {
        return;
    }

    listaCategorias.innerHTML = "";

    if (categorias.length === 0) {
        listaCategorias.innerHTML =
            `<div class="vazio">
                Nenhuma categoria cadastrada.
            </div>`;
        return;
    }

    categorias.forEach(
        (cat, index) => {
            const item =
                document.createElement("div");

            item.className =
                "item-movimentacao";

            item.innerHTML = `
                <div class="item-info">
                    <strong>${cat}</strong>
                </div>

                <div class="item-acoes">

                    <button
                        type="button"
                        class="editar"
                        onclick="editarCategoria(${index})">
                        Editar
                    </button>

                    <button
                        type="button"
                        class="excluir"
                        onclick="excluirCategoria(${index})">
                        Excluir
                    </button>

                </div>
            `;

            listaCategorias.appendChild(item);
        }
    );
}


window.editarCategoria =
    function(index) {
        categoriaIndexEdicao.value =
            index;

        nomeNovaCategoria.value =
            categorias[index];

        tituloFormCategoria.textContent =
            "Editar categoria";

        btnSalvarCategoria.textContent =
            "Atualizar Categoria";

        btnCancelarCategoria.style.display =
            "inline-block";

        nomeNovaCategoria.focus();
    };


// Limpa o formulário de categoria e volta para o modo "cadastrar".
function limparFormularioCategoria() {
    categoriaIndexEdicao.value = "";
    nomeNovaCategoria.value = "";
    tituloFormCategoria.textContent =
        "Adicionar nova categoria";

    btnSalvarCategoria.textContent =
        "Cadastrar Categoria";

    btnCancelarCategoria.style.display =
        "none";
}

btnCancelarCategoria.addEventListener(
    "click",
    limparFormularioCategoria
);


window.excluirCategoria =
    function(index) {
        const catRemovida =
            categorias[index];

        const emUso =
            movimentacoes.some(
                m =>
                    m.categoria ===
                    catRemovida
            );

        if (emUso) {
            alert(
                "Não é possível excluir esta categoria pois existem movimentações vinculadas a ela."
            );
            return;
        }

        if (
            !confirm(
                `Deseja excluir a categoria "${catRemovida}"?`
            )
        ) {
            return;
        }

        categorias.splice(index, 1);

        atualizarSelectsCategorias();
        renderizarCategorias();

        localStorage.setItem(
            "categorias",
            JSON.stringify(categorias)
        );

        renderizarTela();
    };

// Cadastro e atualização de movimentações.
// Aqui os dados do formulário são validados e salvos no array de movimentações.
form.addEventListener(
    "submit",
    (e) => {
        e.preventDefault();

        const id =
            campoId.value;

        const descricao =
            campoDescricao.value.trim();

        const valorTotal =
            converterValorParaNumero(
                campoValor.value
            );

        const tipo =
            campoTipo.value;

        const data =
            campoData.value;

        const categoria =
            campoCategoria.value;

        const meioPagamento =
            campoMeioPagamento.value;

        const parcelas =
            parseInt(
                campoParcelas?.value || 1,
                10
            );

        if (
            isNaN(valorTotal) ||
            valorTotal <= 0
        ) {
            alert(
                "O valor deve ser maior que R$ 0,00."
            );
            campoValor.focus();
            return;
        }

        if (
            !descricao ||
            !tipo ||
            !categoria ||
            !meioPagamento ||
            !data
        ) {
            alert(
                "Preencha todos os campos obrigatórios."
            );
            return;
        }

        if (
            parcelas < 1 ||
            parcelas > 48
        ) {
            alert(
                "O número de parcelas deve estar entre 1 e 48."
            );
            campoParcelas.focus();
            return;
        }

        if (id) {
            // Se existe ID, estamos editando uma movimentação já cadastrada.
            const movimentacao =
                movimentacoes.find(
                    m => m.id == id
                );

            if (!movimentacao) {
                return;
            }

            if (
                movimentacao.grupoParcelamento
            ) {
                // Se era uma compra parcelada, recriamos todas as parcelas atualizadas.
                const grupo =
                    movimentacao.grupoParcelamento;

                movimentacoes =
                    movimentacoes.filter(
                        m =>
                            m.grupoParcelamento !==
                            grupo
                    );

                const novoGrupo =
                    grupo;

                const valorParcela =
                    valorTotal / parcelas;

                const dataBase =
                    new Date(
                        data + "T00:00:00"
                    );

                for (
                    let i = 0;
                    i < parcelas;
                    i++
                ) {
                    const dataParcela =
                        adicionarMesSeguro(
                            dataBase,
                            i
                        );

                    movimentacoes.push({
                        id:
                            Date.now() +
                            Math.random(),
                        descricao:
                            `${descricao} (${i + 1}/${parcelas})`,
                        valor:
                            valorParcela,
                        valorTotal:
                            valorTotal,
                        tipo:
                            tipo,
                        data:
                            paraISO(dataParcela),
                        categoria:
                            categoria,
                        meioPagamento:
                            meioPagamento,
                        parcelaAtual:
                            i + 1,
                        totalParcelas:
                            parcelas,
                        grupoParcelamento:
                            novoGrupo
                    });
                }
            } else {
                // Atualização de uma movimentação comum usando map() e spread operator.
                movimentacoes =
                    movimentacoes.map(
                        m => {
                            if (m.id == id) {
                                return {
                                    ...m,
                                    descricao,
                                    valor:
                                        valorTotal,
                                    valorTotal:
                                        valorTotal,
                                    tipo,
                                    data,
                                    categoria,
                                    meioPagamento,
                                    parcelaAtual: 1,
                                    totalParcelas: 1,
                                    grupoParcelamento:
                                        null
                                };
                            }
                            return m;
                        }
                    );
            }
        } else {
            if (
                tipo === "saida" &&
                meioPagamento === "credito" &&
                parcelas > 1
            ) {
                // Nova compra parcelada: cria uma movimentação para cada parcela.
                const grupoParcelamento =
                    `parcelamento_${Date.now()}_${Math.random()
                        .toString(36)
                        .substring(2, 8)}`;

                const valorParcela =
                    valorTotal / parcelas;

                const dataBase =
                    new Date(
                        data + "T00:00:00"
                    );

                for (
                    let i = 0;
                    i < parcelas;
                    i++
                ) {
                    const dataParcela =
                        adicionarMesSeguro(
                            dataBase,
                            i
                        );

                    movimentacoes.push({
                        id:
                            Date.now() +
                            Math.random(),
                        descricao:
                            `${descricao} (${i + 1}/${parcelas})`,
                        valor:
                            valorParcela,
                        valorTotal:
                            valorTotal,
                        tipo:
                            "saida",
                        data:
                            paraISO(dataParcela),
                        categoria:
                            categoria,
                        meioPagamento:
                            "credito",
                        parcelaAtual:
                            i + 1,
                        totalParcelas:
                            parcelas,
                        grupoParcelamento:
                            grupoParcelamento
                    });
                }
            } else {
                // Nova movimentação simples, sem parcelamento.
                movimentacoes.push({
                    id:
                        Date.now() +
                        Math.random(),
                    descricao,
                    valor:
                        valorTotal,
                    valorTotal:
                        valorTotal,
                    tipo,
                    data,
                    categoria,
                    meioPagamento,
                    parcelaAtual: 1,
                    totalParcelas: 1,
                    grupoParcelamento:
                        null
                });
            }
        }

        localStorage.setItem(
            "movimentacoes",
            JSON.stringify(movimentacoes)
        );

        limparFormulario();
        renderizarTela();
    }
);

// Volta o formulário de movimentação ao estado inicial.
function limparFormulario() {
    form.reset();
    campoId.value = "";
    btnSalvar.textContent =
        "Salvar movimentação";

    btnCancelar.style.display =
        "none";

    campoData.value =
        paraISO(new Date());

    campoValor.value =
        "0,00";

    campoMeioPagamento.innerHTML = `
        <option value="" disabled selected>
            Selecione
        </option>
    `;

    if (campoParcelasWrapper) {
        campoParcelasWrapper.style.display =
            "none";
    }

    if (campoParcelas) {
        campoParcelas.value = 1;
    }
}

btnCancelar.addEventListener(
    "click",
    limparFormulario
);

window.editarMovimentacao =
    function(id) {
        // Busca a movimentação clicada e coloca seus dados de volta no formulário.
        const mov =
            movimentacoes.find(
                m => m.id == id
            );

        if (!mov) {
            return;
        }

        campoId.value =
            mov.id;

        let descricao =
            mov.descricao;

        if (mov.grupoParcelamento) {
            descricao =
                descricao.replace(
                    /\s*\(\d+\/\d+\)$/,
                    ""
                );
        }

        campoDescricao.value =
            descricao;

        const valorExibicao =
            mov.grupoParcelamento
                ? (
                    mov.valorTotal ||
                    mov.valor * mov.totalParcelas
                )
                : mov.valor;

        campoValor.value =
            valorExibicao.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

        campoTipo.value =
            mov.tipo;

        atualizarMeiosPagamento(
            mov.meioPagamento
        );

        if (
            mov.grupoParcelamento
        ) {
            const primeiraParcela =
                movimentacoes
                    .filter(
                        m =>
                            m.grupoParcelamento ===
                            mov.grupoParcelamento
                    )
                    .sort(
                        (a, b) =>
                            a.parcelaAtual -
                            b.parcelaAtual
                    )[0];

            campoData.value =
                primeiraParcela
                    ? primeiraParcela.data
                    : mov.data;
        } else {
            campoData.value =
                mov.data;
        }

        campoCategoria.value =
            mov.categoria;

        if (campoParcelas) {
            campoParcelas.value =
                mov.grupoParcelamento
                    ? mov.totalParcelas
                    : 1;
        }

        verificarExibicaoParcelas();

        btnSalvar.textContent =
            "Atualizar movimentação";

        btnCancelar.style.display =
            "inline-block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

window.excluirMovimentacao =
    function(id) {
        // Remove uma movimentação comum ou todas as parcelas de uma compra parcelada.
        const movimentacao =
            movimentacoes.find(
                m => m.id == id
            );

        if (!movimentacao) {
            return;
        }

        if (
            movimentacao.grupoParcelamento
        ) {
            const quantidade =
                movimentacao.totalParcelas;

            const confirmar =
                confirm(
                    `Esta movimentação faz parte de uma compra parcelada em ${quantidade}x.\n\n` +
                    `Deseja excluir TODAS as parcelas dessa compra?`
                );

            if (!confirmar) {
                return;
            }

            movimentacoes =
                movimentacoes.filter(
                    m =>
                        m.grupoParcelamento !==
                        movimentacao.grupoParcelamento
                );
        } else {
            const confirmar =
                confirm(
                    "Deseja excluir esta movimentação?"
                );

            if (!confirmar) {
                return;
            }

            movimentacoes =
                movimentacoes.filter(
                    m =>
                        m.id != id
                );
        }

        localStorage.setItem(
            "movimentacoes",
            JSON.stringify(movimentacoes)
        );

        renderizarTela();
    };

// Filtros por tipo: todas, entradas ou saídas.
botoesFiltroTipo.forEach(
    botao => {
        botao.addEventListener(
            "click",
            () => {
                botoesFiltroTipo.forEach(
                    b =>
                        b.classList.remove(
                            "ativo"
                        )
                );

                botao.classList.add(
                    "ativo"
                );

                filtroTipoAtual =
                    botao.getAttribute(
                        "data-filtro"
                    );

                renderizarTela();
            }
        );
    }
);

// Filtro rápido de período na aba de movimentações.
botoesPeriodoPagina1.forEach(
    botao => {
        botao.addEventListener(
            "click",
            () => {
                if (
                    botao.classList.contains(
                        "ativo"
                    )
                ) {
                    botao.classList.remove(
                        "ativo"
                    );
                    filtroPeriodoMesesPagina1 = null;
                } else {
                    botoesPeriodoPagina1.forEach(
                        b =>
                            b.classList.remove(
                                "ativo"
                            )
                    );

                    botao.classList.add(
                        "ativo"
                    );

                    filtroPeriodoMesesPagina1 =
                        parseInt(
                            botao.getAttribute(
                                "data-periodo"
                            ),
                            10
                        );
                }

                renderizarTela();
            }
        );
    }
);

// Filtro rápido de período na aba de fatura.
botoesPeriodoFatura.forEach(
    botao => {
        botao.addEventListener(
            "click",
            () => {
                botoesPeriodoFatura.forEach(
                    b =>
                        b.classList.remove(
                            "ativo"
                        )
                );

                botao.classList.add(
                    "ativo"
                );

                mesesFaturaSelecionados =
                    parseInt(
                        botao.getAttribute(
                            "data-periodo"
                        ),
                        10
                    );

                if (filtroMesAnoFatura) {
                    filtroMesAnoFatura.value = "";
                }
                filtroMesAnoFaturaEspecifico = "";

                renderizarTela();
            }
        );
    }
);

if (filtroMesAnoFatura) {
    // Filtro específico de mês/ano para a fatura do cartão.
    filtroMesAnoFatura.addEventListener("change", () => {
        filtroMesAnoFaturaEspecifico = filtroMesAnoFatura.value;
        
        if (filtroMesAnoFaturaEspecifico) {
            botoesPeriodoFatura.forEach(b => b.classList.remove("ativo"));
        }

        renderizarTela();
    });
}

// Filtros adicionais da aba de movimentações.
filtroCategoria.addEventListener(
    "change",
    () => {
        filtroCategoriaAtual =
            filtroCategoria.value;

        renderizarTela();
    }
);


filtroMeioPagamento.addEventListener(
    "change",
    () => {
        filtroMeioPagamentoAtual =
            filtroMeioPagamento.value;

        renderizarTela();
    }
);


filtroDataInicio.addEventListener(
    "change",
    () => {
        filtroDataInicioAtual =
            filtroDataInicio.value;

        renderizarTela();
    }
);


filtroDataFim.addEventListener(
    "change",
    () => {
        filtroDataFimAtual =
            filtroDataFim.value;

        renderizarTela();
    }
);

// Limpa todos os filtros e volta para a visualização padrão.
btnLimparFiltros.addEventListener(
    "click",
    () => {
        filtroTipoAtual =
            "todas";

        filtroPeriodoMesesPagina1 = 0;

        filtroCategoriaAtual =
            "todas";

        filtroMeioPagamentoAtual =
            "todas";

        filtroDataInicioAtual =
            "";

        filtroDataFimAtual =
            "";

        botoesFiltroTipo.forEach(
            b =>
                b.classList.remove(
                    "ativo"
                )
        );

        const botaoTodas =
            document.querySelector(
                '.filtros-tipo .filtro[data-filtro="todas"]'
            );

        if (botaoTodas) {
            botaoTodas.classList.add(
                "ativo"
            );
        }

        botoesPeriodoPagina1.forEach(
            b =>
                b.classList.remove(
                    "ativo"
                )
        );

        const botaoEsteMes = document.querySelector('#filtrosPeriodoPagina1 .filtro[data-periodo="0"]');
        if (botaoEsteMes) {
            botaoEsteMes.classList.add("ativo");
        }

        filtroCategoria.value =
            "todas";

        filtroMeioPagamento.value =
            "todas";

        filtroDataInicio.value =
            "";

        filtroDataFim.value =
            "";

        renderizarTela();
    }
);

// Função central da tela.
// Ela aplica filtros, monta as listas e recalcula totais sempre que os dados mudam.
function renderizarTela() {
    atualizarSelectsCategorias();
    renderizarCategorias();

    // Aplica todos os filtros selecionados sobre o array de movimentações.
    let filtradas =
        movimentacoes.filter(
            m => {
                const atendeTipo =
                    filtroTipoAtual === "todas" ||
                    m.tipo === filtroTipoAtual;

                const atendeCat =
                    filtroCategoriaAtual === "todas" ||
                    m.categoria === filtroCategoriaAtual;

                const atendePag =
                    filtroMeioPagamentoAtual === "todas" ||
                    m.meioPagamento === filtroMeioPagamentoAtual;

                const atendeInicio =
                    !filtroDataInicioAtual ||
                    m.data >= filtroDataInicioAtual;

                const atendeFim =
                    !filtroDataFimAtual ||
                    m.data <= filtroDataFimAtual;

                if (
                    filtroPeriodoMesesPagina1 !== null
                ) {
                    const hoje = new Date();
                    let dataInicioPeriodo = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    let dataFimPeriodo = new Date(hoje.getFullYear(), hoje.getMonth() + filtroPeriodoMesesPagina1 + 1, 0);

                    const dataInicioISO = paraISO(dataInicioPeriodo);
                    const dataFimISO = paraISO(dataFimPeriodo);

                    if (
                        m.data < dataInicioISO ||
                        m.data > dataFimISO
                    ) {
                        return false;
                    }
                }

                return (
                    atendeTipo &&
                    atendeCat &&
                    atendePag &&
                    atendeInicio &&
                    atendeFim
                );
            }
        );

    filtradas.sort(
        (a, b) =>
            new Date(b.data) -
            new Date(a.data)
    );

    listaMovimentacoes.innerHTML = "";

    // Monta a lista de movimentações que aparece na tela.
    if (
        filtradas.length === 0
    ) {
        listaMovimentacoes.innerHTML =
            `<div class="vazio">
                Nenhuma movimentação encontrada.
            </div>`;
    } else {
        filtradas.forEach(
            m => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "item-movimentacao";

                const [ano, mes, dia] =
                    m.data.split("-");

                const dataFormatada =
                    `${dia}/${mes}/${ano}`;

                let informacaoParcela = "";

                if (
                    m.grupoParcelamento
                ) {
                    informacaoParcela =
                        ` • Parcela ${m.parcelaAtual}/${m.totalParcelas}`;
                }

                item.innerHTML = `
                    <div class="item-info">
                        <strong>
                            ${m.descricao}
                        </strong>

                        <span>
                            ${dataFormatada}
                            • ${m.categoria}
                            • ${nomeMeioPagamento(m.meioPagamento)}
                            ${informacaoParcela}
                        </span>
                    </div>

                    <div class="item-valores">
                        <strong
                            class="${m.tipo}">
                            ${m.tipo === "entrada"
                                ? "+"
                                : "-"
                            }
                            ${formatarMoeda(m.valor)}
                        </strong>

                        <div class="item-acoes">
                            <button
                                type="button"
                                class="editar"
                                onclick="editarMovimentacao(${m.id})">
                                Editar
                            </button>

                            <button
                                type="button"
                                class="excluir"
                                onclick="excluirMovimentacao(${m.id})">
                                Excluir
                            </button>
                        </div>
                    </div>
                `;

                listaMovimentacoes.appendChild(
                    item
                );
            }
        );
    }

    // Calcula totais usando filter() para separar os tipos e reduce() para somar valores.
    const somaEntradas =
        movimentacoes
            .filter(
                m =>
                    m.tipo === "entrada"
            )
            .reduce(
                (acc, m) =>
                    acc + Number(m.valor),
                0
            );

    const somaSaidas =
        movimentacoes
            .filter(
                m =>
                    m.tipo === "saida"
            )
            .reduce(
                (acc, m) =>
                    acc + Number(m.valor),
                0
            );

    const saldo =
        somaEntradas -
        somaSaidas;

    totalEntradas.textContent =
        formatarMoeda(
            somaEntradas
        );

    totalSaidas.textContent =
        formatarMoeda(
            somaSaidas
        );

    saldoAtual.textContent =
        formatarMoeda(
            saldo
        );

    // Monta a fatura considerando apenas saídas pagas no crédito.
    let faturaCredito = [];

    if (filtroMesAnoFaturaEspecifico) {
        faturaCredito =
            movimentacoes.filter(
                m => {
                    return (
                        m.meioPagamento === "credito" &&
                        m.tipo === "saida" &&
                        m.data.startsWith(filtroMesAnoFaturaEspecifico)
                    );
                }
            );
    } else {
        const hoje = new Date();
        let dataInicioFatura = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        let dataFimFatura = new Date(hoje.getFullYear(), hoje.getMonth() + mesesFaturaSelecionados + 1, 0);

        const dataInicioFaturaISO = paraISO(dataInicioFatura);
        const dataFimFaturaISO = paraISO(dataFimFatura);

        faturaCredito =
            movimentacoes.filter(
                m => {
                    return (
                        m.meioPagamento === "credito" &&
                        m.tipo === "saida" &&
                        m.data >= dataInicioFaturaISO &&
                        m.data <= dataFimFaturaISO
                    );
                }
            );
    }

    faturaCredito.sort(
        (a, b) =>
            new Date(a.data) -
            new Date(b.data)
    );

    const somaFatura =
        faturaCredito.reduce(
            (acc, m) =>
                acc + Number(m.valor),
            0
        );

    totalFaturaCredito.textContent =
        formatarMoeda(
            somaFatura
        );

    listaFatura.innerHTML = "";

    if (
        faturaCredito.length === 0
    ) {
        listaFatura.innerHTML =
            `<div class="vazio">
                Nenhum gasto registrado no cartão de crédito para este período.
            </div>`;
    } else {
        faturaCredito.forEach(
            m => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "item-movimentacao";

                const [ano, mes, dia] =
                    m.data.split("-");

                let parcela = "";

                if (
                    m.grupoParcelamento
                ) {
                    parcela =
                        ` • Parcela ${m.parcelaAtual}/${m.totalParcelas}`;
                }

                item.innerHTML = `
                    <div class="item-info">
                        <strong>
                            ${m.descricao}
                        </strong>

                        <span>
                            Data: ${dia}/${mes}/${ano}
                            • ${m.categoria}
                            ${parcela}
                        </span>
                    </div>

                    <div class="item-valores">
                        <strong class="saida">
                            - ${formatarMoeda(m.valor)}
                        </strong>
                    </div>
                `;

                listaFatura.appendChild(
                    item
                );
            }
        );
    }

    textoFiltro.textContent =
        `Mostrando ${filtradas.length} de ${movimentacoes.length} movimentações`;
}

// Configuração inicial da página ao abrir o projeto.
campoData.value =
    paraISO(new Date());

campoValor.value =
    "0,00";

atualizarMeiosPagamento();
verificarExibicaoParcelas();

const botaoEsteMesP1 = document.querySelector('#filtrosPeriodoPagina1 .filtro[data-periodo="0"]');
if (botaoEsteMesP1) {
    botaoEsteMesP1.classList.add("ativo");
}

renderizarTela();
