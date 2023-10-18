// Função para iniciar o jogo
// Função para iniciar o jogo
function startGame() {
  
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-game");
  const playerButton = document.getElementById("play-music");
  const lblResposta = document.getElementById("lbl-resposta");
  const resposta = document.getElementById("resposta");
  const btnResposta = document.getElementById("btn-resposta");
  const scoreElement = document.getElementById("score");
  const firstPageElements = document.querySelectorAll("#header, .title-container, #player-name, #start-game");
  firstPageElements.forEach((element) => {
    element.style.display = "none";
  });

  startButton.remove();

  // Função para iniciar a contagem regressiva
  function startCountdown(count) {
    if (count === 0) {
      countdown.remove();
      playerButton.style.display = "block"; // Mostra o botão de pausa
      lblResposta.classList.remove("hidden");
      btnResposta.classList.remove("hidden");
      resposta.style.display = "block"; // Mostra a caixa de texto
      resposta.focus(); // Foca na caixa de texto
  
      // Mostrar o contêiner de controles de música e imagem personalizada
      const musicControlsContainer = document.getElementById("music-controls-container");
      musicControlsContainer.classList.remove("hidden");
  
      // Mostrar a imagem personalizada após a contagem regressiva
      const customImage = document.getElementById("custom-image");
      customImage.classList.remove("hidden");
      scoreElement.classList.remove("hidden");
      updateScore(); // Atualiza a exibição da pontuação
    } else {
      countdown.innerText = count;
      setTimeout(() => {
        startCountdown(count - 1);
      }, 1000);
    }
  }
  
 

  const countdown = document.createElement("h1");
  countdown.innerText = "3";
  gameContainer.appendChild(countdown);

  // Iniciar a contagem regressiva após um breve atraso
  setTimeout(() => {
    startCountdown(2); // Iniciar a contagem regressiva a partir de 2
  }, 1000);
}

/// Adicione um evento de clique ao botão de pausa
document.getElementById("play-music").addEventListener("click", function () {
  const playIcon = document.getElementById("play-icon");

  // Verifique a classe atual do ícone
  if (playIcon.classList.contains("fa-play")) {
    // Se a classe atual for "fa-play", altere para "fa-pause"
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");

    // Coloque o código para iniciar ou retomar a reprodução de música aqui
    // Por exemplo, player.resume() se você estiver usando o Spotify Web Playback SDK
    player.resume();
  } else {
    // Se a classe atual não for "fa-play", altere de volta para "fa-play"
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");

    // Coloque o código para pausar a reprodução de música aqui
    // Por exemplo, player.pause() se você estiver usando o Spotify Web Playback SDK
    player.pause();
  }
});


let playerScore = -1;
let player;
let trackName;
let connect_to_device;

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `Pontuação: ${playerScore}`;
}
playerScore++; // Incrementa a pontuação em 1 ponto
updateScore(); // Atualiza a exibição da pontuação na tela

window.onSpotifyWebPlaybackSDKReady = () => {
  //Trocar o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started 
  const token ="BQDyWO83SS1ZybRXESGoPHPHgGejFam9yEhADHfDyHjO-eC6gDrxzv8I7b6_lmBDvVgneWtWhBmpcYcslBBI7uI5EhEzyutX_OQ0EZTFDhCveh2xwZlM16tyktiEHUFqYTAIPf4UqcFO2Hl7U7e1xmBkxTVojRDm0LF4OoLP37ANQ5QK9R2265U9SCwiWSVacEhFucTVtYyUK9_arlTyH2QTYzWy"
    player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });


  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    connect_to_device = () => {
      let album_uri = "spotify:album:18HaPkTt6Ez7yKgjJ3wRht"
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: album_uri,
          play: false,
        }),
        headers: new Headers({
            "Authorization": "Bearer " + token,
        }),
    }).then(response => console.log(response))
    .then(data => {
      // Adicionar listener para o evento de mudança de estado de reprodução
      player.addListener('player_state_changed', ({
        track_window
      }) => {
        trackName = track_window.current_track.name;
        trackName = trackName.toLowerCase();
        console.log('Current Track:', trackName);
      });})}
    
  });

//botão play music para tocar a musica por 13 segundos
document.getElementById("play-music").addEventListener('click',() => {
    
    connect_to_device();
    setTimeout(() => {
      player.pause();
    }, 13000);
  });
  
//botão resposta para verificar se a resposta está correta apagar a resposta e mudar a musica do play-music para a proxima
document.getElementById("btn-resposta").addEventListener('click', (event) => {
  event.preventDefault();
  let resposta = document.getElementById("resposta").value;
  resposta = resposta.toLowerCase();
  if (resposta === trackName) {
    alert("Você Acertou, Parabéns!");
    playerScore += 10; // Incrementa a pontuação em 10 pontos
  } else {
    // Se a resposta estiver errada, subtrai apenas 5 pontos
    playerScore = Math.max(0, playerScore - 5);
    alert("Você errou, vamos para a próxima!"); 
  }
  document.getElementById("resposta").value = "";
  player.nextTrack();
  setTimeout(() => {
    player.pause();
  }, 1300);

  updateScore();
});




  player.connect();  
};

