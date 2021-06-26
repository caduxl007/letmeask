import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
// import { useAuth } from "../hooks/useAuth";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const history = useHistory();

  // const { user } = useAuth();
  const { title, questions } = useRoom(roomId);

  async function handleCloseRoom() {
    const response = window.confirm(
      "Tem certeza que você deseja fechar a sala?"
    );

    if (response) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });

      history.push('/')
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    const response = window.confirm(
      "Tem certeza que você deseja excluir esta pergunta?"
    );

    if (response) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

      history.push('/')
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Deletar uma pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
