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

    let errors = 0; // Inicializa o contador de erro

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
      
          // Inicia a reprodução da música automaticamente após a contagem regressiva
          player.togglePlay(); // Inicia a reprodução da música após a contagem regressiva
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
  
  // Adicione um evento de clique ao botão de pausa
  document.getElementById("play-music").addEventListener("click", function () {
    const playIcon = document.getElementById("play-icon");
    
    // Verifique a classe atual do ícone
    if (playIcon.classList.contains("fa-play")) {
      // Se a classe atual for "fa-pause", altere para "fa-play"
      playIcon.classList.remove("fa-play");
      playIcon.classList.add("fa-pause");
      
      // Coloque o código para pausar a reprodução de música aqui
      // Por exemplo, player.pause() se você estiver usando o Spotify Web Playback SDK
    } else {
      // Se a classe atual não for "fa-pause", altere de volta para "fa-pause"
      playIcon.classList.remove("fa-pause");
      playIcon.classList.add("fa-play");
      
      // Coloque o código para retomar a reprodução de música aqui
      // Por exemplo, player.togglePlay() se você estiver usando o Spotify Web Playback SDK
    }
  });
  
  
  let playerScore = -1;
  let player;
  let trackName;
  
  function updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Pontuação: ${playerScore}`;
  }
  playerScore++; // Incrementa a pontuação em 1 ponto
  updateScore(); // Atualiza a exibição da pontuação na tela
  
  window.onSpotifyWebPlaybackSDKReady = () => {
    //Trocar o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started 
    const token ="BQAaceKVbYQyi4RgAFS00HINieRX7io2pS6Ao7QpoVZ5HrC6phBL1nUx9O9lVPNEbDGtZmfcQRZlzf2drIvSZZV62w3KRtdPwtJlfFyge3Ap5A-QckwoQXm5fUQc8HUUCdeuL6Qs8CeNsB0HYiRejWSL1rtyKLAlWpI55IsQzht-HXu-5J3LdINBrG8d8NvMyslx21bVRLH0UnhCC_2WuPLXhPpK"
      player = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      const connect_to_device = () => {
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
      connect_to_device();
    });
  
    let pauseClicks = 0; // Inicializa o número de cliques no botão de pausa

document.getElementById("play-music").addEventListener('click', () => {
  player.togglePlay();
  setTimeout(() => {
    player.pause();
  }, 13000);

  const playIcon = document.getElementById("play-icon");
  if (playIcon.classList.contains("fa-pause")) {
    pauseClicks++;
    if (pauseClicks > 1) {
      playerScore -= 2; // Penalidade de 2 pontos por clique no botão de pausa a partir do segundo clique
      updateScore();
    }
  }
});
  

let errors = 0;
  //botão resposta para verificar se a resposta está correta apagar a resposta e mudar a musica do play-music para a proxima
  document.getElementById("btn-resposta").addEventListener('click', (event) => {
    event.preventDefault();
    let respostaValue = resposta.value.toLowerCase();
    if (respostaValue === trackName) {
      alert("Você Acertou, Parabéns!");
      playerScore += 10; // Incrementa a pontuação em 10 pontos
      document.getElementById("resposta").value = "";
      player.nextTrack(); // Passa para a próxima faixa
      setTimeout(() => {
        player.pause();
      }, 1300);
      updateScore();
    } else {
      // Se a resposta estiver errada, subtrai apenas 5 pontos
      playerScore = Math.max(0, playerScore - 5);
      alert("Você errou, vamos para a próxima!");
      errors++; // Incrementa o número de erros
      if (errors >= 3) {
        alert("Você errou 3 vezes. O jogo será reiniciado."); // Alerta de reinício do jogo
        window.location.reload(); // Recarrega a página para reiniciar o jogo
      } else {
        player.nextTrack(); // Toca a próxima música imediatamente
        player.resume(); // Resumo a reprodução automaticamente
      }
      document.getElementById("resposta").value = "";
      updateScore();
    }
  });

  
  
  
  
    player.connect();  
  };
  