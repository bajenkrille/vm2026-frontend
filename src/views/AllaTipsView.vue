<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import { useTipsStore } from "@/stores/tipsStore";
import { useMatcherStore } from "@/stores/matcherStore";
import { useDeltagareStore } from "@/stores/deltagareStore"

const showMenu = ref(false)
const pageSize = ref('20')
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
const deltagarePerSida = ref('5')

const setDeltagarePerSida = (antal) => {
	deltagarePerSida.value = antal
	showMenu.value = false
}
const synligaDeltagare = computed(() => {
	const start = deltagarSida.value * deltagarePerSida.value
	return deltagareStore.deltagare.slice(start, start + deltagarePerSida.value)
})
</script>

<template>
	<div>
		<h1 class="mt-3">Allas tips.</h1>
    <p>Det går att ändra sitt tips ända fram till utsatt avsparkstid för första matchen, dvs 11/6 kl. 21.00.</p>
		<button type="button" class="btn btn-dark" @click="deltagarSida--" :disabled="deltagarSida === 0">
			Previous participants
		</button>

		<button type="button" class="btn btn-dark"
			@click="deltagarSida++"
			:disabled="(deltagarSida + 1) * deltagarePerSida >= deltagareStore.deltagare.length"
		>
			Next participants
		</button>
		<div class="dropdown position-relative d-inline-block">
			<button
				class="btn btn-secondary dropdown-toggle"
				type="button"
				@click="showMenu = !showMenu"
			>
				Visa {{ deltagarePerSida }}
			</button>

			<ul
				v-if="showMenu"
				class="dropdown-menu show"
				style="position: absolute; top: 100%; left: 0;"
			>
				<li v-for="size in [5, 10, 20, 50]" :key="size">
					<button
						class="dropdown-item"
						type="button"
						@click="setDeltagarePerSida(size)"
					>
						{{ size }}
					</button>
				</li>
			</ul>
		</div>
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
