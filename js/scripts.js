const playNow = () => {
  console.log('Yo ho yo ho a pirates life for me');
  $('#play-game-modal').css('display', 'block');
};

const startGame = () => {
  console.log("Ahoy mateys were off!");
  document.location.href = './players.html'
};

const closeModal = (event) => {
  const closeTarget = $(event.target).data('close');
  const modalToClose = $(`#${closeTarget}`);
  modalToClose.css('display', 'none');
}

const getNumPlayers = () => {
  return localStorage.getItem('num-players');
}

const saveNumPlayers = (e) => {
  const target = $(e.target)
  localStorage.setItem('num-players', target.data('num-players'));
  localStorage.removeItem('players');
  
  console.log(target);
  // clear the previous selection before highlighting the new selection
  target.siblings('.selected').removeClass('selected');
  target.addClass('selected');
}

const loadCreatePlayerModal = (numPlayers, currentPlayers) => {
  const colorOptions = $('#player-colors li');

  const selectedColors = currentPlayers.map(p => {
    return p.color
  });

  for (let i = 0; i < numPlayers; ++i) {
    const option = $(colorOptions[i])
    const color = option.data('color');

    if (selectedColors.includes(color)) {
      continue;
    }

    option.css('background-color', color);
    option.css('display', 'flex');
  }
};

/**
 * Gets the Players Array from Local Storage
 * @returns array
 */
const getPlayers = () => {
  const players = localStorage.getItem('players');
  if (players) {
    return JSON.parse(players);
  }

  return [];
}

/**
 * Saves players in Loal Storage
 * @param array players 
 */
const savePlayers = (players) => {
  localStorage.setItem('players', JSON.stringify(players));
}

const addPlayer = (player) => {
  const players = getPlayers();
  players.push(player);
  savePlayers(players);
}

const selectPlayerColor = (e) => {
  const target = $(e.target);
  // clear the previous selection before highlighting the new selection
  target.siblings('.selected').removeClass('selected fa fa-check');
  target.addClass('selected fa fa-check');
};

const createPlayer = (e) => {
  const name = $('#player-name').val()
  const color = $('#player-colors li.selected').attr('data-color');
  
  if (!name || !color) {
    e.preventDefault()
    $('#create-player-error').text('Arrrgh! Enter a captains name and select a color for yer Jolly Rodger you landlubber!')
  } else {
    addPlayer({ name, color });
  }
}

const pageLoad = () => {
  const players = getPlayers();
  const numPlayers = getNumPlayers();

  if (players.length < numPlayers) {
    loadCreatePlayerModal(numPlayers, players);
  } else {
    // TODO this is where I would navigate to either the large board or the small board
    // based on the number of players
    $('#create-player-modal').css('display', 'none');
  }
}

$('#play-now-btn').on('click', playNow);
$('#start-game-btn').on('click', startGame);
$('#play-game-modal').delegate('.modal-close', 'click', closeModal);
$('#play-game-modal').delegate('#num-players > img', 'click', saveNumPlayers);
$('#create-player-modal').delegate('#player-colors > li', 'click', selectPlayerColor);
$('#create-player-btn').on('click', createPlayer);

pageLoad();
