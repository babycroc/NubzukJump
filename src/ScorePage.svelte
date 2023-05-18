<script>
  import { Link } from "svelte-routing";
  import { ref, get, set } from "firebase/database";

  import { database } from "./firebase";

  let scoreBoard = [];
  const myScore = localStorage.getItem("score");
  let myNickname = "";

  const dbRef = ref(database, "/");
  const loadData = () => {
    get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        scoreBoard = data.sort((a, b) => {
          if (a.score > b.score) return -1;
          else return 1;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const saveData = (nickname, score) => {
    set(dbRef, scoreBoard.concat({ nickname: nickname, score: score }));
    loadData();
  };

  loadData();
</script>

<main>
  <h1>Game over!</h1>
  <h2>Your score is: {myScore}</h2>
  <input type="text" bind:value={myNickname} />
  <button type="submit" on:click={() => saveData(myNickname, myScore)}
    >Save</button
  >

  <Link href="/"><button>Restart!</button></Link>

  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Nickname</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {#each Object.values(scoreBoard) as row, index}
        <tr>
          <td>{index + 1}</td>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 0 auto;
  }
  th,
  td {
    padding: 10px;
  }
</style>
