const playNow = () => {
  console.log('Yo ho yo ho a pirates life for me');
  $('#play-game-modal').css('display', 'block');
};

const startGame = () => {
  console.log("Ahoy mateys were off!");
  const numPlayers = localStorage.getItem('num-players');
  if (numPlayers < 3) {
    //load small board
  } else {
    // load large board
    document.location.href = './large-board.html';
  }
};

const closeModal = (event) => {
  const closeTarget = $(event.target).data('close');
  const modalToClose = $(`#${closeTarget}`);
  modalToClose.css('display', 'none');
}

const saveNumPlayers = (e) => {
  const target = $(e.target)
  localStorage.setItem('num-players', target.data('num-players'));
  
  // clear the previous selection before highlighting the new selection
  target.siblings('.selected').removeClass('selected');
  target.addClass('selected');
}

$('#play-now-btn').on('click', playNow);
$('#start-game-btn').on('click', startGame);
$('#play-game-modal').delegate('.modal-close', 'click', closeModal);
$('#play-game-modal').delegate('#num-players img', 'click', saveNumPlayers);
