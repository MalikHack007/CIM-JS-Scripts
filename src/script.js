// Wait for the DOM to be fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the radio buttons
    const isCaseSpecificYes = document.getElementById('isCaseSpecificYes');
    const isCaseSpecificNo = document.getElementById('isCaseSpecificNo');
    const caseTypeDiv = document.getElementById('caseTypeDiv');

    // Function to show or hide the Case Type field
    function toggleCaseType(isCaseSpecificYes) {
        caseTypeDiv.style.display = isCaseSpecificYes ? 'block' : 'none';
    }

    // Add event listeners to the radio buttons
    isCaseSpecificYes.addEventListener('click', function () {
        toggleCaseType(true);
    });

    isCaseSpecificNo.addEventListener('click', function () {
        toggleCaseType(false);
    });
});
