document.addEventListener('DOMContentLoaded', () => {
	const forms = document.querySelectorAll('.auth-form');
	if (!forms.length) return;

	const removeErrors = (form) => {
		form.querySelectorAll('.input-field').forEach(input => input.classList.remove('input-error'));
		form.querySelectorAll('.error-message').forEach(msg => msg.remove());
		const successMessage = form.querySelector('.form-success');
		if (successMessage) {
			successMessage.classList.remove('visible');
			successMessage.textContent = '';
		}
	};

	const showError = (field, message) => {
		if (!field) return;
		field.classList.add('input-error');
		const group = field.closest('.form-group') || field.closest('.checkbox');
		if (!group) return;
		let error = group.querySelector('.error-message');
		if (!error) {
			error = document.createElement('span');
			error.className = 'error-message';
			group.appendChild(error);
		}
		error.textContent = message;
	};

	const validateForm = (form) => {
		let isValid = true;
		removeErrors(form);

		const requiredFields = form.querySelectorAll('.input-field[required], .checkbox input[required]');

		requiredFields.forEach(field => {
			const value = field.type === 'checkbox' ? field.checked : field.value.trim();
			if (!value) {
				isValid = false;
				showError(field, 'Заполните это поле');
			} else if (field.type === 'email' && !field.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
				isValid = false;
				showError(field, 'Введите корректный email');
			} else if (field.type === 'password' && field.value.length < 6) {
				isValid = false;
				showError(field, 'Пароль должен быть не короче 6 символов');
			}
		});

		if (isValid && form.dataset.form === 'signup') {
			const password = form.querySelector('#signup-password');
			const confirm = form.querySelector('#signup-confirm');
			if (password && confirm && password.value !== confirm.value) {
				isValid = false;
				showError(confirm, 'Пароли должны совпадать');
			}
		}

		return isValid;
	};

	const ACCOUNT_URL = '../Личный кабинет/Account.html';

	forms.forEach(form => {
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			if (!validateForm(form)) return;

			const formType = form.dataset.form;

			if (formType === 'signup') {
				const nameField = document.getElementById('signup-name');
				const emailField = document.getElementById('signup-email');

				const user = {
					name: nameField ? nameField.value.trim() : '',
					email: emailField ? emailField.value.trim() : '',
					createdAt: new Date().toISOString()
				};

				localStorage.setItem('kimoshiUser', JSON.stringify(user));
				localStorage.setItem('kimoshiIsLoggedIn', 'true');
			}

			if (formType === 'login') {
				const emailField = document.getElementById('login-email');
				const existingUserRaw = localStorage.getItem('kimoshiUser');
				let user = existingUserRaw ? JSON.parse(existingUserRaw) : {};
				user.email = emailField ? emailField.value.trim() : user.email || '';
				localStorage.setItem('kimoshiUser', JSON.stringify(user));
				localStorage.setItem('kimoshiIsLoggedIn', 'true');
			}

			const successMessage = form.querySelector('.form-success');
			if (successMessage) {
				successMessage.textContent = 'Успешный вход. Перенаправляем в личный кабинет...';
				successMessage.classList.add('visible');
			}

			setTimeout(() => {
				window.location.href = ACCOUNT_URL;
			}, 800);
		});

		form.querySelectorAll('.input-field, .checkbox input').forEach(field => {
			field.addEventListener('input', () => {
				const message = (field.closest('.form-group') || field.closest('.checkbox'))?.querySelector('.error-message');
				if (message) message.remove();
				field.classList.remove('input-error');
			});
		});
	});
});

