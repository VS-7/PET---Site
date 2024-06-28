import React from "react";
import styles from "./BusSchedule.module.css";

const BusSchedule = () => {
  // Dados dos horários de ônibus (exemplo)
  const busSchedule = [
    { linha: "Linha 1", partida: "07:00", chegada: "07:30" },
    { linha: "Linha 2", partida: "08:00", chegada: "08:30" },
    { linha: "Linha 3", partida: "09:00", chegada: "09:30" },
    // Adicione mais horários conforme necessário
  ];

  return (
    <div className={styles.busSchedule}>
      <h2>Horários de Ônibus para IFSUDESTE MG - Campus Rio Pomba</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Linha</th>
            <th>Partida</th>
            <th>Chegada</th>
          </tr>
        </thead>
        <tbody>
          {busSchedule.map((schedule, index) => (
            <tr key={index}>
              <td>{schedule.linha}</td>
              <td>{schedule.partida}</td>
              <td>{schedule.chegada}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusSchedule;
