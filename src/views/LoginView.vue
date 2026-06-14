<script setup>
import { reactive, ref } from "vue";
import { useLoginStore } from "@/stores/loginStore";
import OneOptionModal from "@/components/OneOptionModal.vue";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute()

const loginErrors = ref(false);
const loginMessage = ref("");

const resetMailGenerated = ref(false);
const resetMailMessage = ref("");

const userForLogin = ref("")
const userForReset = ref("")
const credentials = reactive({
	user: "",
});

const loginStore = useLoginStore();

const onSubmit = async () => {
  credentials.user = userForLogin.value
	const result = await loginStore.loginUser(credentials);
	if (result.status === 401) {
		loginMessage.value = "Användarnamn och/eller password är felaktigt";
		loginErrors.value = true;
		return;
	}
	console.log("STATUS: ", result.status);
	if (result.status === 200) {
		// router.replace("/tippa");
    const redirect = route.query.redirect || "/stallning"
    router.replace(redirect)
	}
};

const generateResetEmail = async () => {
  credentials.user = userForReset.value
  const result = await loginStore.generateResetEmail(credentials)
	if (result.status === 200){
	  resetMailMessage.value = "Ett mail har skickats med en länk för reset av ditt password."
  	resetMailGenerated.value = true
	} else {
	  resetMailMessage.value = "Något gick fel. Det ska vara användarnamn och inte email."
  	resetMailGenerated.value = true
	}
}
</script>

<template>
	<OneOptionModal
		v-if="loginErrors"
		title="Fel vid inloggning"
		:message="loginMessage"
		confirmText="OK"
		@confirm="loginErrors = false"
	/>
	<OneOptionModal
		v-if="resetMailGenerated"
		title=""
		:message="resetMailMessage"
		confirmText="OK"
		@confirm="resetMailGenerated = false"
	/>
	<br />
	<h2 class="mb-3">Logga in för att komma åt ditt tips mm!</h2>

	<form @submit.prevent="onSubmit" action="">
		<div class="mb-3 mt-3">
			<label for="exampleFormControlInput1" class="form-label"
				>Användarnamn</label
			>
			<input
				v-model="userForLogin"
				type="text"
				class="form-control"
				id="exampleFormControlInput1"
				placeholder="Användarnamn"
			/>
		</div>
		<div class="b-3 mb-3">
			<label for="inputPassword5" class="form-label">Password</label>
			<input
				v-model="credentials.password"
				type="password"
				id="inputPassword5"
				class="form-control"
				aria-describedby="passwordHelpBlock"
			/>
			<div id="passwordHelpBlock" class="form-text"></div>
		</div>
		<input type="submit" value="Login" class="btn btn-primary" />
	</form>
	<form @submit.prevent="generateResetEmail" action="">
		<div class="mb-3 mt-5">
			<label for="exampleFormControlInput1" class="form-label"
				>Glömt lösenordet?</label
			>
			<input
				v-model="userForReset"
				type="text"
				class="form-control"
				id="exampleFormControlInput1"
				placeholder="Användarnamn"
			/>
		</div>
		<input type="submit" value="Reset" class="btn btn-primary" />
	</form>
</template>
