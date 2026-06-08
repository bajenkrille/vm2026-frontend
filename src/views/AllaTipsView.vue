<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import { useTipsStore } from "@/stores/tipsStore";
import { useMatcherStore } from "@/stores/matcherStore";
import { useDeltagareStore } from "@/stores/deltagareStore"
import OneOptionModal from "@/components/OneOptionModal.vue";
import TwoOptionModal from "@/components/TwoOptionModal.vue";

const showIncompleteModal = ref(false);
const incompleteMessage = ref("");
const showTipsSentModal = ref(false);
const tipsSentMessage = ref("");
const tipsStore = useTipsStore();
const matcherStore = useMatcherStore();
const deltagareStore = useDeltagareStore();

onMounted(() => {
	deltagareStore.getDeltagare();
	console.log("Alla deltagare: ",deltagareStore.deltagare);
	matcherStore.getMatchSchedule();
	tipsStore.getAllTips();
});

const deltagarSida = ref(0)
const deltagarePerSida = 5
const synligaDeltagare = computed(() => {
	const start = deltagarSida.value * deltagarePerSida
	return deltagareStore.deltagare.slice(start, start + deltagarePerSida)
})
</script>

<template>
	<div>
		<h1 class="mt-3">Allas tips.</h1>
    <p>Det går att ändra sitt tips ända fram till utsatt avsparkstid för första matchen, dvs 11/6 kl. 21.00.</p>
		<OneOptionModal
			v-if="showTipsSentModal"
			title="Tips mottaget"
			:message="tipsSentMessage"
			confirmText="Ok"
			@confirm="showTipsSentModal = false"
		/>
		<button @click="deltagarSida--" :disabled="deltagarSida === 0">
			Previous participants
		</button>

		<button
			@click="deltagarSida++"
			:disabled="(deltagarSida + 1) * pageSize >= deltagareStore.deltagare.length"
		>
			Next participants
		</button>
		<table class="table table-dark table-hover">
			<thead>
				<tr>
					<th class="col_match" scope="col">#</th>
					<th class="col_date" scope="col">Date</th>
					<th class="col_team" scope="col">Home</th>
					<th class="col_dash" scope="col">-</th>
					<th class="col_team" scope="col">Away</th>
					<th v-for="deltagare in synligaDeltagare" :key="deltagare.id" class="col_tips" scope="col">{{ deltagare.nick_name }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="game in matcherStore.games">
					<th scope="row">{{ game.id }}</th>
					<td>
						<span>{{ game.date }}</span>
					</td>
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
					<td v-for="usr in synligaDeltagare">
						<div class="d-flex">
							<span>{{ tipsStore.tipsMap[usr.id]?.[game.id]?.join('-') ?? '' }}</span>
							<span>
								<!-- <input
									class="form-control tipsruta"
									:value="readTips(game.id, 1)"
									@input="tipsStore.setTip(game.id, 1, $event.target.value)"
								/> -->
							</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
.tipsruta {
	width: 2.5rem;
	height: 2rem;
}

.col_match {
	width: 3px;
}

.col_date {
	width: 10px;
}
/* 
.col_group {
	width: 8%;
	text-align: center;
} */

.col_dash {
	width: 2px;
}

.col_team {
	width: 50px;
	text-align: center;
}

.col_tips {
	width: 100px;
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
