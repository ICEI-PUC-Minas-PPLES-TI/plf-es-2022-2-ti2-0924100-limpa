const loadServices = async () => {
  const container = document.getElementById('container-servicos');
  container.innerHTML = null;
  let img = document.createElement('IMG');
  img.setAttribute('src', '../imgs/loading-gif.gif');
  container.appendChild(img);

  const token = localStorage.getItem('token');
  if (!token) return;

  let response;
  try {
    response = await fetch('http://localhost:3003/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(response => response.json());
  } catch (err) {
    console.log(err.message);
  }

  response = response.services.rows;
  localStorage.setItem('servicesAvailable', JSON.stringify(response));
  img.remove();
  generateServicosCards();
};
window.onload = loadServices;

const getServices = () => JSON.parse(localStorage.getItem('servicesAvailable'));

const generateServicosCards = () => {
  const container = document.getElementById('container-servicos');
  const services = getServices();
  container.innerHTML = null;

  services?.forEach(service => {
    let card = document.createElement('DIV');
    let num_servico_criado = document.createElement('H1');
    let num_servico_criadoT = document.createTextNode(
      `Serviço: ${service.num_servico_criado}`
    );
    num_servico_criado.appendChild(num_servico_criadoT);
    card.appendChild(num_servico_criado);
    let bairro = document.createElement('P');
    let bairroT = document.createTextNode(`Bairro: ${service.bairro}`);
    bairro.appendChild(bairroT);
    card.appendChild(bairro);
    let cep = document.createElement('P');
    let cepT = document.createTextNode(`CEP: ${service.cep}`);
    cep.appendChild(cepT);
    card.appendChild(cep);
    let cidade = document.createElement('P');
    let cidadeT = document.createTextNode(`Cidade: ${service.cidade}`);
    cidade.appendChild(cidadeT);
    cidade.appendChild(bairro);
    let comodos = document.createElement('P');
    let comodosT = document.createTextNode(`Cômodos: ${service.comodos}`);
    comodos.appendChild(comodosT);
    card.appendChild(comodos);
    let descricao_atividade = document.createElement('P');
    let descricao_atividadeT = document.createTextNode(
      `Descrição: ${service.descricao_atividade}`
    );
    descricao_atividade.appendChild(descricao_atividadeT);
    card.appendChild(descricao_atividade);
    let logradouro = document.createElement('P');
    let logradouroT = document.createTextNode(
      `Logradouro ${service.logradouro}`
    );
    logradouro.appendChild(logradouroT);
    card.appendChild(logradouro);
    let numero = document.createElement('P');
    let numeroT = document.createTextNode(`Número: ${service.numero}`);
    numero.appendChild(numeroT);
    card.appendChild(numero);
    let uf = document.createElement('P');
    let ufT = document.createTextNode(`UF: ${service.uf}`);
    uf.appendChild(ufT);
    card.appendChild(uf);
    let data_horario = document.createElement('P');
    let data_horarioT = document.createTextNode(
      `Data e Horário: ${new Date(service.data_horario).toLocaleString()}`
    );
    data_horario.appendChild(data_horarioT);
    card.appendChild(data_horario);
    let valor = document.createElement('P');
    let valorT = document.createTextNode(
      `Valor: ${service.valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`
    );
    valor.appendChild(valorT);
    card.appendChild(valor);

    card.setAttribute(
      'onclick',
      `handleServiceCardClick(${service.num_servico_criado})`
    );

    card.classList = `card ${service.status.toLowerCase()}`;
    container.appendChild(card);
  });
};

const logoutBtn = document.querySelector('.navSair');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('servicesAvailable');

  location.pathname = '/src/client';
});

const modal = document.querySelector('.modalInsercao');
const handleServiceCardClick = numServico => {
  const service = getServices()?.find(
    service => service.num_servico_criado === numServico
  );
  if (!service) return;

  modal.style.display = 'block';
  document.querySelector('#desc').innerHTML =
    'Descrição de atividades: ' + service.descricao_atividade;
  document.querySelector('#lograd').innerHTML =
    'Logradouro: ' + service.logradouro;
  document.querySelector('#numero').innerHTML = 'Número: ' + service.numero;
  document.querySelector('#comp').innerHTML =
    'Complemento: ' + service.complemento;
  document.querySelector('#cep').innerHTML = 'CEP: ' + service.cep;
  document.querySelector('#bairro').innerHTML = 'Bairro: ' + service.bairro;
  document.querySelector('#comodos').innerHTML = 'Cômodos: ' + service.comodos;
  document.querySelector('#dataHora').innerHTML =
    'Data/Hora: ' + new Date(service.data_horario).toLocaleString();
  document.querySelector('#valor').innerHTML =
    'Valor: ' +
    service.valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  const button = document.querySelector('#serviceActionBtn');
  button.className = service.status.toLowerCase();
  button.innerHTML =
    service.status === 'ABERTO'
      ? 'Pegar Serviço'
      : service.status === 'ACEITO'
      ? 'Aceito'
      : service.status === 'PAGAMENTO'
      ? 'Pagamento Pendente'
      : 'Finalizado';
  if (service.status === 'ABERTO')
    button.setAttribute(
      'onclick',
      `handleTakeService(${service.num_servico_criado})`
    );
};

const handleTakeService = async numServico => {
  const token = localStorage.getItem('token');
  if (!token || !numServico) return;

  const res = await fetch('http://localhost:3003/services/take/' + numServico, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 200) {
    modal.style.display = 'none';
    loadServices();
  }
};
