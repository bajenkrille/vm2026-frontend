<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useTipsStore } from "@/stores/tipsStore";
import { useMatcherStore } from "@/stores/matcherStore";
import OneOptionModal from "@/components/OneOptionModal.vue";
import TwoOptionModal from "@/components/TwoOptionModal.vue";

const formreference = ref(null);
const showIncompleteModal = ref(false);
const incompleteMessage = ref("");
const showTipsSentModal = ref(false);
const tipsSentMessage = ref("");
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
	tipsStore.getTips();
});

const onSubmit = async () => {
	console.log("SUBMITTED");
	const incompleteGames = tipsStore.checkTipsComplete();
	const numberOfIncompleteGames = incompleteGames.length;
	let gamesList = "";
	if (numberOfIncompleteGames !== 0 && numberOfIncompleteGames < 11) {
		gamesList = incompleteGames;
	}
	const hasIncompleteTips = numberOfIncompleteGames !== 0 ? true : false; // replace with your real check
	if (hasIncompleteTips) {
		incompleteMessage.value = `${numberOfIncompleteGames} matcher har inte tippats! ${gamesList}`;
		showIncompleteModal.value = true;
		return;
	}
	try {
		const res = await tipsStore.sendTips();
		tipsSentMessage.value = "Ditt tips har skickats in. Ett email ska också ha skickats till dig."
	  showTipsSentModal.value = true
	} catch (error) {
		tipsSentMessage.value = "Något gick fel. Försök igen."
		showTipsSentModal.value = true
	}
	console.log("Heja Bajen ");
};

const saveDraft = async () => {
	// save partial tips here
	try {
		await tipsStore.sendTips();
		showIncompleteModal.value = false;
		tipsSentMessage.value = "Ditt tips har skickats in. Ett email ska också ha skickats till dig."
  	showTipsSentModal.value = true
	} catch (error) {
		showIncompleteModal.value = false;
		tipsSentMessage.value = "Något gick fel. Försök igen."
		showTipsSentModal.value = true
	}
	// showIncompleteModal.value = false;
  // tipsSentMessage.value = "Ditt tips har skickats in. Ett email ska också ha skickats till dig."
  // showTipsSentModal.value = true
};
</script>

<template>
	<div>
		<h1 class="mt-3">Här tippar du.</h1>
    <p>Tippa alla resultat. Vill du inte tippa allt på en gång kan du spara och logga ut och fortsätta senare.</p>
    <p>Det går att ändra sitt tips ända fram till utsatt avsparkstid för första matchen, dvs 11/6 kl. 21.00.</p>
		<OneOptionModal
			v-if="showTipsSentModal"
			title="Tips mottaget"
			:message="tipsSentMessage"
			confirmText="Ok"
			@confirm="showTipsSentModal = false"
		/>
		<TwoOptionModal
			v-if="showIncompleteModal"
			title="Icke komplett tips"
			:message="incompleteMessage"
			confirmText="Save and continue later"
			cancelText="Continue editing"
			@confirm="saveDraft"
			@cancel="showIncompleteModal = false"
		/>
		<form ref="formreference" action="">
      <button @click.prevent="onSubmit" class="btn btn-success mb-3" type="submit">
				Skicka/spara
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
										:value="readTips(game.id, 0)"
										@input="tipsStore.setTip(game.id, 0, $event.target.value)"
									/>
								</span>
								<span>
									<input
										class="form-control tipsruta"
										:value="readTips(game.id, 1)"
										@input="tipsStore.setTip(game.id, 1, $event.target.value)"
									/>
								</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<button @click.prevent="onSubmit" class="btn btn-success mb-5" type="submit">
				Skicka/spara
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
