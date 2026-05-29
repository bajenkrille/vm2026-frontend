<script setup>
import { reactive, ref } from "vue";
import { useLoginStore } from "@/stores/loginStore";
import router from "@/router";
import TwoOptionModal from "@/components/TwoOptionModal.vue";

const credentials = reactive({
	fornamn: "",
	efternamn: "",
	user: "",
	email: "",
	password: "",
	phone: "",
});

const loginStore = useLoginStore();

const validationErrors = ref(false);
const validationMessage = ref("");
const regSuccess = ref(false);

const validateForm = () => {
	if (!credentials.fornamn.trim()) return "Förnamn krävs";
	if (!credentials.efternamn.trim()) return "Efternamn krävs";
	if (!credentials.user.trim()) return "Användarnamn krävs";

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(credentials.email)) return "Ogiltig emailadress";

	if (credentials.password.length < 5)
		return "Lösenordet ska vara minst 5 tecken";
	const pswRegex = /^[A-Za-zÅÄÖåäö0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
	if (!pswRegex.test(credentials.password))
		return "Ogiltigt tecken i lösenordet";
};

const clearForm = () => {
	credentials.fornamn = "";
	credentials.efternamn = "";
	credentials.user = "";
	credentials.email = "";
	credentials.password = "";
	credentials.phone = "";
};

const logout = () => {
	localStorage.removeItem("token");
	router.replace("/login");
};

const continueToTips = () => {
	router.replace("/tippa");
};

const onSubmit = async () => {
	const errorMsg = validateForm();
	if (errorMsg) {
		validationMessage.value = errorMsg;
		validationErrors.value = true;
		return;
	}
	const result = await loginStore.registerUser(credentials);
	if (result.status === 409) {
		validationMessage.value = "Användarnamnet är upptaget. Försök igen!";
		validationErrors.value = true;
	}
	if (result.status === 201) {
		clearForm();
		regSuccess.value = true;
	}
	console.log("Heja Bajen " + credentials.email + " " + credentials.password);
};
</script>

<template>
	<br />
	<h2>Gabbagabbahey</h2>
	<TwoOptionModal
		v-if="validationErrors"
		title="Incomplete tips"
		:message="validationMessage"
		confirmText="Fuck you"
		cancelText="Förlåt"
		@confirm="saveDraft"
		@cancel="validationErrors = false"
	/>
	<TwoOptionModal
		v-if="regSuccess"
		title="Välkommen till VM-tipset!"
		message="Registrering gick bra. Vill du fortsätta till tipset eller logga ut?"
		confirmText="Tippa"
		cancelText="Logout"
		@confirm="continueToTips"
		@cancel="logout"
	/>

	<form @submit.prevent="onSubmit" action="">
		<div class="row mb-3">
			<div class="col">
				<label for="fornamn" class="form-label">Förnamn *</label>
				<input
					v-model="credentials.fornamn"
					type="text"
					class="form-control"
					id="fornamn"
					required
				/>
			</div>
			<div class="col">
				<label for="efternamn" class="form-label">Efternamn *</label>
				<input
					v-model="credentials.efternamn"
					type="text"
					class="form-control"
					id="efternamn"
					required
				/>
			</div>
		</div>
		<div class="mb-3">
			<label for="userName" class="form-label">Artistnamn/användarnamn *</label>
			<input
				v-model="credentials.user"
				type="text"
				class="form-control"
				id="userName"
				placeholder="Pelé"
				required
			/>
		</div>
		<div class="mb-3">
			<label for="email" class="form-label">Email address *</label>
			<input
				v-model="credentials.email"
				type="email"
				class="form-control"
				id="email"
				placeholder="name@example.com"
				required
			/>
		</div>
		<div class="mb-3">
			<label for="inputPassword5" class="form-label">Password *</label>
			<input
				v-model="credentials.password"
				type="password"
				id="inputPassword5"
				class="form-control"
				aria-describedby="passwordHelpBlock"
				required
			/>
			<div id="passwordHelpBlock" class="form-text">
				Välj ett lösenord som du INTE har på andra viktiga ställen. Det ska vara
				minst 5 tecken och INTE innehålla blanksteg eller emojis.
			</div>
			<div class="mb-3 mt-2">
				<label for="userName" class="form-label"
					>Mobiltelefonnummer (för SMS)</label
				>
				<input
					v-model="credentials.phone"
					type="text"
					class="form-control"
					id="mobile"
				/>
			</div>
		</div>
		<input type="submit" value="Register" class="btn btn-primary" />
	</form>
</template>
