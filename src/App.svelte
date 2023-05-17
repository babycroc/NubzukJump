<script>
  import { Router, Route } from "svelte-routing";
  import MainPage from "./MainPage.svelte";
  import ScorePage from "./ScorePage.svelte";
</script>

<main>
  <Router>
    <Route path="/" component={MainPage} />
    <Route path="/score" component={ScorePage} />
  </Router>
</main>
