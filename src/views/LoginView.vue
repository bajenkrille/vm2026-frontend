<script setup>
import { reactive, ref } from "vue";
import { useLoginStore } from "@/stores/loginStore";
import TwoOptionModal from "@/components/TwoOptionModal.vue";
import router from "@/router";

const loginErrors = ref(false);
const loginMessage = ref("");

const credentials = reactive({
	user: "",
	password: "",
});

const loginStore = useLoginStore();

const onSubmit = async () => {
	const result = await loginStore.loginUser(credentials);
	if (result.status === 401) {
		loginMessage.value = "Fel kombination av användarnamn/email och password";
		loginErrors.value = true;
		return;
	}
	console.log("STATUS: ", result.status);
	if (result.status === 200) {
		router.replace("/tippa");
	}
};
</script>

<template>
	<TwoOptionModal
		v-if="loginErrors"
		title="Fel vid inloggning"
		:message="loginMessage"
		confirmText="OK"
		cancelText="OK"
		@confirm="loginErrors = false"
		@cancel="loginErrors = false"
	/>

	<form @submit.prevent="onSubmit" action="">
		<div class="mb-3 mt-3">
			<label for="exampleFormControlInput1" class="form-label"
				>Användarnamn</label
			>
			<input
				v-model="credentials.user"
				type="text"
				class="form-control"
				id="exampleFormControlInput1"
				placeholder="Användarnamn eller email"
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
</template>
