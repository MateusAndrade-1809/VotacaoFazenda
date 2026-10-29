import { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticipanteCard from '../components/ParticipanteCard';
import {
  listarNaRoca,
  listarForaDaRoca,
  registrarVoto,
} from '../services/votacaoService';

function Votacao() {
  const [ultimoVoto, setUltimoVoto] = useState(null);
  const [quantidadeVotos, setQuantidadeVotos] = useState(0);
  const [erro, setErro] = useState('');
  const naRoca = listarNaRoca();
  const foraDaRoca = listarForaDaRoca();

  function handleVotar(participante) {
    try {
      registrarVoto(participante.id);
      setUltimoVoto(participante);
      setQuantidadeVotos((quantidade) => quantidade + 1);
      setErro('');
    } catch {
      setErro('Não foi possível salvar o voto. Verifique se o navegador permite o armazenamento local.');
    }
  }

  return (
    <main className="pagina votacao">
      <h1>Quem você quer eliminar?</h1>
      <p className="subtitulo">Cada clique conta um voto pra tirar o peão da fazenda.</p>

      <section className="grade-roca" aria-label="Participantes na roça">
        {naRoca.map((participante) => (
          <ParticipanteCard
            key={participante.id}
            participante={participante}
            onVotar={handleVotar}
          />
        ))}
      </section>

      <div role="status" aria-live="polite">
        {ultimoVoto && (
          <p className="confirmacao">
            Voto registrado para eliminar <strong>{ultimoVoto.nome}</strong>! Você já votou{' '}
            <strong>{quantidadeVotos} {quantidadeVotos === 1 ? 'vez' : 'vezes'}</strong>.{' '}
            <Link to="/resultado">Ver parcial</Link>
          </p>
        )}
      </div>
      {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

      <section className="demais-peoes" aria-labelledby="titulo-demais">
        <h2 id="titulo-demais">Demais peões</h2>
        <p>Fora da roça nesta semana, não podem receber votos.</p>
        <div className="grade-participantes">
          {foraDaRoca.map((participante) => (
            <ParticipanteCard key={participante.id} participante={participante} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Votacao;
