 /**


         * Функционал кнопки sign up
         */
        document.getElementById('register').addEventListener('click', handleSignUp, false);

        function handleSignUp() {
            
            var name = document.getElementById('register_name').value;
            var email = document.getElementById('register_login').value;
            var password = document.getElementById('register_password').value;
            var passwordConfirm = document.getElementById('register_confirmation').value;
            var messageAlertRegister=document.getElementById('register_form_message');
                    messageAlertRegister.className=('alert ');
                    messageAlertRegister.innerHTML = " ";
            if (email.length < 4) {
                alert('Пожалуйста введите email');
                return;
            }
            if (password.length < 4) {
                alert('Пожалуйста введите пароль');
                return;
            }
            if (password !=passwordConfirm || !password) {
                alert('Неверный пароль подтверждения');
                return;
            }
            // Регистрируемся через email
            // [Начинаем регистрацию]

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // В случае ошибок
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    messageAlertRegister.className=('alert ');
                    messageAlertRegister.innerHTML = " ";
                    alert(errorMessage);
                }
                console.log(error);
                //messageAlertRegister.className=('alert alert-success');
                //messageAlertRegister.innerHTML = "<strong></strong>  Ваша учетная запись существует.";
              
            });
            // [Заканчиваем регистрацию]

        }


        /**
         * Функционал кнопки Входа
         */

document.getElementById('auth').addEventListener('click', toggleSignIn, false);
/**
         * Функционал кнопки sign in/sign out
         */
        function toggleSignIn() {

            // Если пользователь залогинен
            if (firebase.auth().currentUser) {
                // [Начинаем разлогиниваться]
                firebase.auth().signOut();
                document.getElementById('register_form').style.display = 'block';
                document.querySelector('.hidden-elems').style.display = 'block';
                document.getElementById('register_name').value=" ";
                //console.log('exit+');
                // [Заканчиваем разлогиниваться]
            } else {
                var email = document.getElementById('auth_login').value;
                var password = document.getElementById('auth_password').value;
                var messageAlertAuth=document.getElementById('auth_form_message');

                if (email.length < 4) {
                    alert('Пожалуйста введите email.');
                    return;
                }
                if (password.length < 4) {
                    alert('Пожалуйста введите пароль.');
                    return;
                }
                // Логинимся через email
                // [Начинаем логин через email]
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                    // В случае ошибок
                    
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        messageAlertAuth.className=('alert alert-danger');
                        messageAlertAuth.innerHTML = "<strong>Введен!</strong>Неверный пароль! ";
                    } else {
                        alert(errorMessage);
                    }
                    console.log(error);
                    document.getElementById('auth').disabled = false;
                });
                // [Заканчиваем логин через email]
            document.getElementById('auth').disabled = true;
            
            }

        }



        function initApp() {
            
            
            // Слушаем статус аутентификации
            firebase.auth().onAuthStateChanged(function(user) {
                // [Выключаем другую кнопку]
                
                var messageAlertRegister=document.getElementById('register_form_message');
                var messageAlertAuth=document.getElementById('auth_form_message');
                
                if (user) {
                    // Если пользователь залогинен
                    //console.log('user=true');
                    var name =document.getElementById('register_name').value;
                    //console.log('name:'+name);
                    if (name) {//если пользователь авторизовался и указал имя то добавляем имя.
                        firebase.auth().currentUser.updateProfile({
                        displayName: name
                        }).then(function() {//onsole.log('updateName+');
                        }).catch(function(error) {//console.log('updateName-');
                        });
                    }
                    var displayName = user.displayName; if(!displayName){displayName=" ";}
                    var email = user.email;
                    var emailVerified = user.emailVerified;//console.log(emailVerified);
                    var photoURL = user.photoURL;
                    var isAnonymous = user.isAnonymous;
                    var uid = user.uid;
                    var providerData = user.providerData;
 
                    document.getElementById('register_form').style.display = 'none';
                    document.querySelector('.hidden-elems').style.display = 'none';
                    document.getElementById('sidebar-addition-functions').style.display='block';
                    messageAlertRegister.className='alert alert-success';
                    messageAlertRegister.innerHTML = "Здарвствуйте <strong>"+displayName+"</strong> ,Вы выполнили вход используя почту: "+"<strong>"+email+"</strong>";
                    messageAlertAuth.className='alert alert-success';
                    messageAlertAuth.innerHTML = "Здарвствуйте <strong>"+displayName+"</strong> ,Вы уже выполнили вход используя почту: "+"<strong>"+email+"</strong>";           
                    // [Устанавливаем текст на кнопках]                    
                    document.getElementById('auth').textContent = 'Выйти';
                    //var details=document.getElementById('account-details').textContent = JSON.stringify(user, null, '  ');
                    // if (!emailVerified) {
                    //      // sendEmailVerification();
                    // }
            
                    console.log('mail: '+email+ ' name:'+displayName);
                } else {
                    // Если пользователь разлогинен
                    // [Устанавливаем текст на кнопках]
                    
                    messageAlertRegister.className='';
                    messageAlertRegister.innerHTML = "";
                    messageAlertAuth.className='';
                    messageAlertAuth.innerHTML = "";
                    document.getElementById('auth').textContent = 'Войти';
                    document.getElementById('sidebar-addition-functions').style.display='none';

                }
                // [Выключаем другую кнопку]
                document.getElementById('auth').disabled = false;
            });


        }

        window.onload = function() {
            initApp();
        };


        function sendEmailVerification() {//отправляем текущему пользователю email с подтвержением
            firebase.auth().currentUser.sendEmailVerification().then(function() {
                alert('Проверьте вашу почту и подтвердите ваш Email!');
            });
        }