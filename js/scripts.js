const playNow = () => {
  console.log('Yo ho yo ho a pirates life for me');
  $('#play-game-modal').css('display', 'block');
};

const startGame = () => {
  console.log("Ahoy mateys were off!")
};

const closeModal = (event) => {
  const closeTarget = $(event.target).data('close');
  const modalToClose = $(`#${closeTarget}`);
  modalToClose.css('display', 'none');
}

$('#play-now-btn').on('click', playNow);
$('#start-game-btn').on('click', startGame);
$('#play-game-modal').delegate('.modal-close', 'click', closeModal);
