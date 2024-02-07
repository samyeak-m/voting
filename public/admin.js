const socket = io(window.location.origin);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('updateVotes', (candidates) => {
    var ranked_candidates = candidates;
    function comparebyvote(a, b){
        return -a.votes + b.votes;
    }
    ranked_candidates.sort(comparebyvote);
    console.log('Received updated votes:', ranked_candidates);
    updateDashboard(ranked_candidates);
    console.log("ok");
});

function updateDashboard(candidates) {
    var dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';     

    candidates.forEach(function (candidate, index) {
        var candidateInfo = document.createElement('div');
        candidateInfo.innerHTML = '<div class="rank">' + (index + 1) + '</div>' +
            '<div class="name">' + candidate.name + '</div>' +
            '<div class="stall_no">' + candidate.stall_no + '</div>' +
            '<div class="vote">' + candidate.votes + '</div>';

        dashboard.appendChild(candidateInfo);
    });
}