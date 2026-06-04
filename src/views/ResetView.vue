<script setup>
import { reactive, ref } from "vue";
import { useLoginStore } from "@/stores/loginStore";
import OneOptionModal from "@/components/OneOptionModal.vue";
import TwoOptionModal from "@/components/TwoOptionModal.vue";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute()

const validationErrors = ref(false);
const validationMessage = ref("");

const password = ref('')
const confirmPassword = ref('')

const credentials = reactive({
	token: "",
	password: "",
});

const loginStore = useLoginStore();


const validateForm = () => {
	if (password.value.length < 5 || confirmPassword.value.length < 5)
		return "Lösenordet ska vara minst 5 tecken";
	const pswRegex = /^[A-Za-zÅÄÖåäö0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
	if (!pswRegex.test(password.value))
		return "Ogiltigt tecken i lösenordet";
	if (password.value !== confirmPassword.value) 
		return "Lösenorden är olika!"
};


const onSubmit = async () => {
	const errorMsg = validateForm();
	if (errorMsg) {
		validationMessage.value = errorMsg;
		validationErrors.value = true;
		return;
	}
	credentials.password = password.value
	credentials.token = route.params.token
	const result = await loginStore.resetPsw(credentials)

	console.log("STATUSSSS: ", result.status);
	if (result.status === 200) {
		router.replace("/login");
	}
};
</script>

<template>
	<OneOptionModal
		v-if="validationErrors"
		title="Fel, fel, fel!"
		:message="validationMessage"
		confirmText="Ok"
		@confirm="validationErrors = false"
	/>
	<TwoOptionModal
		v-if="loginErrors"
		title="Fel vid inloggning"
		:message="loginMessage"
		confirmText="OK"
		cancelText="OK"
		@confirm="loginErrors = false"
		@cancel="loginErrors = false"
	/>
	<br />
	<h2 class="mb-3">Välj nytt password!</h2>

	<form @submit.prevent="onSubmit" action="">
		<div class="mb-2 mt-3">
			<label for="exampleFormControlInput1" class="form-label"
				>Password</label
			>
			<input
				v-model="password"
				type="password"
				class="form-control"
				id="exampleFormControlInput1"
			/>
		</div>
		<div id="passwordHelpBlock" class="form-text">
				Välj ett lösenord som du INTE har på andra viktiga ställen. Det ska vara
				minst 5 tecken och INTE innehålla blanksteg eller emojis.
		</div>
		<div class="b-3 mt-3 mb-3">
			<label for="inputPassword5" class="form-label">Repetera password</label>
			<input
				v-model="confirmPassword"
				type="password"
				id="inputPassword5"
				class="form-control"
				aria-describedby="passwordHelpBlock"
			/>
			<div id="passwordHelpBlock" class="form-text"></div>
		</div>
		<input type="submit" value="Skicka" class="btn btn-primary" />
	</form>
</template>
