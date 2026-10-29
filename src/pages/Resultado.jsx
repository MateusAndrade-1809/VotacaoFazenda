import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  obterVotos,
  calcularTotalVotos,
  calcularResultado,
  zerarVotos,
} from '../services/votacaoService';

function Resultado() {
  const [votos, setVotos] = useState(obterVotos);
  const [erro, setErro] = useState('');
  const total = calcularTotalVotos(votos);
  const resultado = calcularResultado(votos);

  function handleZerar() {
    if (window.confirm('Tem certeza que deseja zerar todos os votos?')) {
      try {
        zerarVotos();
        setVotos({});
        setErro('');
      } catch {
        setErro('Não foi possível zerar a votação. Verifique o armazenamento do navegador.');
      }
    }
  }

  return (
    <main className="pagina resultado">
      <h1>Parcial da eliminação</h1>
      <p className="total-votos">
        <strong>{total.toLocaleString('pt-BR')}</strong>{' '}
        {total === 1 ? 'voto computado' : 'votos computados'}
      </p>

      {total === 0 ? (
        <section className="resultado-vazio">
          <h2>Nenhum voto por aqui ainda.</h2>
          <p>A roça está formada! Dê o primeiro voto e acompanhe a parcial.</p>
          <Link to="/votacao" className="botao botao-principal">Ir votar</Link>
        </section>
      ) : (
        <>
          <section className="placar" aria-label="Resultado da votação">
            {resultado.map((participante, indice) => (
              <article
                key={participante.id}
                className={indice === 0 ? 'placar-item placar-lider' : 'placar-item'}
              >
                <img src={participante.foto} alt={participante.nome} />
                <div className="placar-info">
                  <div className="placar-cabecalho">
                    <h2>{participante.nome}</h2>
                    {indice === 0 && <span className="selo-lider">Sairia hoje</span>}
                  </div>
                  <div
                    className="barra"
                    role="progressbar"
                    aria-label={`Percentual de votos de ${participante.nome}`}
                    aria-valuenow={participante.percentual}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="barra-preenchida" style={{ width: `${participante.percentual}%` }} />
                  </div>
                  <p className="placar-numeros">
                    {participante.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%{' '}
                    ({participante.votos.toLocaleString('pt-BR')} {participante.votos === 1 ? 'voto' : 'votos'})
                  </p>
                </div>
              </article>
            ))}
          </section>
          <button type="button" className="botao botao-zerar" onClick={handleZerar}>
            Zerar votação
          </button>
        </>
      )}
      {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
    </main>
  );
}

export default Resultado;
