<script>
  import { ref, get, set } from "firebase/database";

  import { database } from "./firebase";
  import { onMount } from "svelte";

  let scoreBoard = [];
  const myScore = parseInt(localStorage.getItem("score"));
  let myNickname = "";
  let editMode = true;

  const dbRef = ref(database, "/");
  const loadData = () => {
    get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        scoreBoard = data.sort((a, b) => parseInt(b.score) - parseInt(a.score));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const saveData = (nickname, score) => {
    set(dbRef, scoreBoard.concat({ nickname: nickname, score: score }));
    editMode = false;
    loadData();
  };

  onMount(() => {
    loadData();
  });
</script>

<main>
  <h1>Game over!</h1>
  <p>Nubzuk has failed to graduate... One more try?</p>

  <button
    on:click={() => {
      window.location.href = "/";
    }}>Replay</button
  >

  <div class="form">
    <h2>Your score is: {myScore}</h2>
    {#if editMode}
      <p>Enter nickname to save your score!</p>
      <input type="text" bind:value={myNickname} use:focus />
      <button type="submit" on:click={() => saveData(myNickname, myScore)}
        >Save</button
      >
    {:else}
      Successfully saved!
    {/if}
  </div>

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
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
  }
  th,
  td {
    padding: 10px 20px;
    min-width: 100px;
  }
  th {
    background-color: #40a0d2;
    color: white;
  }
  button {
    background-color: #40a0d2;
    color: white;
    border: none;
    max-width: 100px;
    margin: 0 auto;
    cursor: pointer;
    padding: 7px 12px;
  }
  .form {
    margin: 50px;
  }
  input:hover,
  input:focus {
    border: solid 1px #40a0d2;
  }
</style>
