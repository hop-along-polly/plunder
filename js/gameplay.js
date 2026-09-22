const rollD6 = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const rollStormDie = () => {};

const rollMovementDie = () => {};

const closeModal = (event) => {
  const closeTarget = $(event.target).data('close');
  $(`#${closeTarget}`).css('display', 'none');
};

const backToPort = () => {
  document.location.href = './index.html';
};

$('#under-construction-modal').delegate('.modal-close', 'click', closeModal);
$('#back-to-port-btn').on('click', backToPort);
