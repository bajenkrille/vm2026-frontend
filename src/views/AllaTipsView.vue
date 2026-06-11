<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import { useTipsStore } from "@/stores/tipsStore";
import { useMatcherStore } from "@/stores/matcherStore";
import { useDeltagareStore } from "@/stores/deltagareStore"

const showMenu = ref(false)
const hovered = ref(null)
const tipsStore = useTipsStore();
const matcherStore = useMatcherStore();
const deltagareStore = useDeltagareStore();

onMounted(() => {
	deltagareStore.getDeltagare();
	console.log("Alla deltagare: ",deltagareStore.deltagare);
	matcherStore.getMatchSchedule();
	tipsStore.getAllTips();
	tipsStore.getAndStorePoints();
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

const getHomeGoalColor = (game) => {
	if (game.played === false) return 'text-bg-light'
	if (game.homeGoals > game.awayGoals) return 'text-bg-success'
	if (game.homeGoals < game.awayGoals) return 'text-bg-danger'
	if (game.homeGoals === game.awayGoals) return 'text-bg-warning'
}

const getAwayGoalColor = (game) => {
	if (game.played === false) return 'text-bg-light'
	if (game.homeGoals > game.awayGoals) return 'text-bg-danger'
	if (game.homeGoals < game.awayGoals) return 'text-bg-success'
	if (game.homeGoals === game.awayGoals) return 'text-bg-warning'
}

const getPointsColor = (points) => {
	if (points === 0) return 'text-bg-dark'
	if (points === 1) return 'text-bg-warning'
	if (points === 2) return 'text-bg-success'
	if (points === 3) return 'text-bg-danger'
}

</script>

<template>
	<div>
		<h1 class="mt-3">Alla tips</h1>
    <p>Här finns allas tips. Du kan välja hur många deltagares tips du vill se i taget och stega dig fram genom alla deltagare.</p>
		<p>För spelade matcher indikeras matchtipsets framgångsgrad med en liten färgindikator.</p>
		<p><span class="text-bg-danger">Röd = 3p</span></p>
		<p><span class="text-bg-success">Grön = 2p</span></p>
		<p><span class="text-bg-warning">Gul = 1p</span></p>
		<button type="button" class="btn btn-dark" @click="deltagarSida--" :disabled="deltagarSida === 0">
			Föregående
		</button>

		<button type="button" class="btn btn-dark"
			@click="deltagarSida++"
			:disabled="(deltagarSida + 1) * deltagarePerSida >= deltagareStore.deltagare.length"
		>
			Nästa
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
				<li v-for="size in [5, 10, 15, 50]" :key="size">
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
		<table class="table table-dark table-hover tips-table">
			<thead>
				<tr>
					<th class="sticky-col col_match" scope="col">#</th>
					<th class="sticky-col col_date" scope="col">Date</th>
					<th class="sticky-col col_team" scope="col">Home</th>
					<th class="sticky-col col_dash" scope="col">-</th>
					<th class="sticky-col col_team" scope="col">Away</th>
 					<th v-for="deltagare in synligaDeltagare" :key="deltagare.id" class="col_tips" scope="col">
						<span class="username-wrapper" @mouseenter="hovered = deltagare.nick_name" @mouseleave="hovered = null">
							<span class="username-cell">{{ deltagare.nick_name }}</span>
							<span v-if="hovered === deltagare.nick_name" class="custom-tooltip">
								{{ deltagare.nick_name }}
							</span>
						</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="game in matcherStore.games" :key="game.id">
					<th class="sticky-col" scope="row">{{ game.id }}</th>
					<td class="sticky-col">
						<span>{{ game.date }}</span>
					</td>
					<td>
						<div class="sticky-col d-flex align-items-center">
							<span class="flex-grow-1 text-center d-inline-block text-truncate team">{{ game.home }}</span>
							<span class="d-inline-flex align-items-center justify-content-center
					rounded-circle results_ball" :class="getHomeGoalColor(game)" >{{ game.homeGoals }}</span>
						</div>
					</td>
					<td class="sticky-col">-</td>
					<td>
						<div class="sticky-col d-flex align-items-center">
							<span class="flex-grow-1 text-center d-inline-block text-truncate team">{{game.away}}</span>
							<span class="d-inline-flex align-items-center justify-content-center
					rounded-circle results_ball" :class="getAwayGoalColor(game)">{{ game.awayGoals }}</span>
						</div>
					</td>
 					<td v-for="usr in synligaDeltagare" :key="usr.id">
						<div class="d-flex">
							<span>{{ tipsStore.tipsMap[usr.id]?.[game.id]?.join('-') ?? '' }}</span>
							<span class="rounded-circle points_ball"  :class="getPointsColor(tipsStore.pointsMap[usr.id]?.[game.id] ?? '')">
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
.results_ball {
	height: 25px;
	width: 25px;
	font-size: large;
}
.points_ball {
	height: 10px;
	width: 10px;
	font-size: large;
}
  
.tips-table {
  white-space: nowrap;
}

.sticky-col {
  position: sticky;
  z-index: 2;
}

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

.username-wrapper {
  position: relative;
  display: inline-block;
}

.username-cell {
  max-width: 70px;      /* choose what fits */
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.custom-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  padding: 6px 10px;
  background: #333;
  color: white;
  font-size: 1rem;
  white-space: nowrap;
  z-index: 1000;
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
