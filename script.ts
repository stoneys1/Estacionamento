interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
    clientId?: string;
}

(function(){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);


    function calcTempo(mil: number){
        const hours = Math.floor(mil / 3600000);
        const min = Math.floor(mil/ 60000);
        const sec = Math.floor((mil % 60000) / 1000)

        return `${hours} h, ${min} m, ${sec} s`;
    }

    function patio(){
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function adicionar(veiculo: Veiculo, salva?: Boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa=${veiculo.placa}>X</button>
            </td>
            `;


            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa)
            });

            $("#patio")?.appendChild(row)


          if(salva) salvar([...ler(), veiculo]);
        }
        function remover(placa: string){

            const {entrada , nome} = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if (confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) {
            
            }
            

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        function salvar(veiculos:Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        return {ler , adicionar , remover , render , salvar};

    }

    patio().render();

    $("#cadastrar")?.addEventListener("click" , () =>{
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome||!placa) {
            alert("Nome e Placa Sao Obrigatórios")
            return;
        }


        patio().adicionar({ nome , placa , entrada: new Date().toISOString() }, true);
    });
})();