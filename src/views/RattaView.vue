<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useTipsStore } from "@/stores/tipsStore";
import { useMatcherStore } from "@/stores/matcherStore";

const tipsStore = useTipsStore();
const matcherStore = useMatcherStore();
const readTips = (match, index) => {
	if (!Array.isArray(tipsStore.tips)) {
		return "";
	}

	const savedMatch = tipsStore.tips.find(
		(item) => Number(item.matchId) === Number(match)
	);
	if (savedMatch) {
		return savedMatch.tips[index];
	}
	return "";
};

onMounted(() => {
	matcherStore.getMatchSchedule();
	// tipsStore.getTips();
});

let results = []
const setTip = (matchId, index, goal) => {
	console.log("matchId: ",matchId,"index: ",index, "goal: ",goal);
	let match = results.find(match => match.id === matchId)
	console.log("match: ",match);
	if (!match){
		match = {id: matchId, goals: ['',''], played: true}
		results.push(match)
	}
	match.goals[index] = goal
}

const onSubmit = () => {
	console.log("SUBMITTED");
	matcherStore.setResults(results);
	console.log("Heja Bajen ");
};
</script>

<template>
	<div>
		<h1 class="mt-3">Rätta.</h1>
    <p>Tippa alla resultat. Vill du inte tippa allt på en gång kan du spara och logga ut och fortsätta senare.</p>
    <p>Det går att ändra sitt tips ända fram till utsatt avsparkstid för första matchen, dvs 11/6 kl. 21.00.</p>
		<form action="">
      <button @click.prevent="onSubmit" class="btn btn-success mb-3" type="submit">
				Rätta
			</button>
			<table class="table table-dark table-hover">
				<thead>
					<tr>
						<th class="col_match" scope="col">#</th>
						<th class="col_date" scope="col">Date</th>
						<th class="col_group" scope="col">Group</th>
						<th class="col_team" scope="col">Home</th>
						<th class="col_dash" scope="col">-</th>
						<th class="col_team" scope="col">Away</th>
						<th class="col_tips" scope="col">Tips</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="game in matcherStore.games" :key="game.id">
						<th scope="row">{{ game.id }}</th>
						<td>
							<span class="d-none d-xl-inline">{{ game.weekday }}&nbsp</span
							><span>{{ game.date }}</span>
						</td>
						<td class="col_group">{{ game.group }}</td>
						<td class="col_team">
							<span class="team d-inline-block text-truncate">{{
								game.home
							}}</span>
						</td>
						<td>-</td>
						<td class="col_team">
							<span class="team d-inline-block text-truncate">{{
								game.away
							}}</span>
						</td>
						<td>
							<div class="d-flex">
								<span>
									<input
										class="form-control tipsruta me-1"
										@input="setTip(game.id, 0, $event.target.value)"
										:disabled="game.played === true"
									/>
								</span>
								<span>
									<input
										class="form-control tipsruta"
										@input="setTip(game.id, 1, $event.target.value)"
										:disabled="game.played === true"
									/>
								</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<button @click.prevent="onSubmit" class="btn btn-success mb-5" type="submit">
				Rätta
			</button>
		</form>
	</div>
</template>

<style scoped>
.tipsruta {
	width: 2.5rem;
	height: 2rem;
}

.col_match {
	width: 5%;
}

.col_date {
	width: 8%;
}

.col_group {
	width: 8%;
	text-align: center;
}

.col_dash {
	width: 2%;
}

.col_team {
	width: 34%;
	text-align: center;
}

.col_tips {
	width: 9%;
}

.tipsruta {
	width: 2.5rem;
	height: 2rem;
}

.team {
	max-width: 170px;
}

@media (max-width: 768px) {
	.team {
		max-width: 100px;
	}
}
</style>
