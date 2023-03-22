<script lang="ts">
	import '@/app.css';
	import Notifications from 'svelte-notifications';
	import Modal from 'svelte-simple-modal';

	import Toast from '@/lib/components/Toast.svelte';

	let _Toast = Toast;
</script>

<main class="grid place-items-center w-full h-full bg-[rgba(52,53,65)] text-gray-100">
	<Notifications item={_Toast}>
		<Modal closeButton={true} unstyled={false} styleWindow={{ width: '90%' }}>
			<slot />
		</Modal>
	</Notifications>
</main>

<style>
	:global(body) {
		width: 100vw;
		height: 100vh;
	}
</style>
