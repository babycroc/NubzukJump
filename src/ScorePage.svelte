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
    text-align: center;
    margin: 0 auto;
  }
  th,
  td {
    padding: 10px;
  }
  button {
    max-width: 100px;
    margin: 0 auto;
  }
  .form {
    margin: 50px;
  }
</style>
