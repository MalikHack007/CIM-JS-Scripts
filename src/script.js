document.addEventListener('DOMContentLoaded', () => {
    const isCaseSpecificRadios = document.querySelectorAll('input[name="isCaseSpecific"]');
    const hasPaidRadios = document.querySelectorAll('input[name="hasPaid"]');
    const isPpRadios = document.querySelectorAll('input[name="isPp"]');
    const anotherPriorityDateRadios = document.querySelectorAll('input[name="anotherPriorityDate"]');
    const isInsideUSRadios = document.querySelectorAll('input[name="isInsideUS"]');
  
    const usersCaseContainer = document.getElementById('usersCaseContainer');
    const remainingAttorneyFeeContainer = document.getElementById('remainingAttorneyFeeContainer');
    const countryOfBirthContainer = document.getElementById('countryOfBirthContainer');
    const priorityDateIsCurrentContainer = document.getElementById('priorityDateIsCurrentContainer');
    const anotherPriorityDateContainer = document.getElementById('anotherPriorityDateContainer');
    const priorityDateContainer = document.getElementById('priorityDateContainer');
    const isInsideUSContainer = document.getElementById('isInsideUSContainer');
    const h1bIsExpiringContainer = document.getElementById('h1bIsExpiringContainer');
    const serviceCenterContainer = document.getElementById('serviceCenterContainer');
    const processingTimeContainer = document.getElementById('processingTimeContainer');
  
    function moveUsersCaseAfter(targetContainer) {
      targetContainer.insertAdjacentElement('afterend', usersCaseContainer);
    }
  
    function updateVisibility() {
      const isCaseSpecific = document.querySelector('input[name="isCaseSpecific"]:checked')?.value;
      const hasPaid = document.querySelector('input[name="hasPaid"]:checked')?.value;
      const isPp = document.querySelector('input[name="isPp"]:checked')?.value;
      const anotherPriorityDate = document.querySelector('input[name="anotherPriorityDate"]:checked')?.value;
      const isInsideUS = document.querySelector('input[name="isInsideUS"]:checked')?.value;
      const usersCase = document.querySelector('select[name="usersCase"]')?.value;
  
      // Show/hide User's Case and determine its position
      if (isCaseSpecific === 'yes') {
        usersCaseContainer.classList.remove('hidden');
        document.getElementById('isCaseSpecificContainer').insertAdjacentElement('afterend', usersCaseContainer);
      } else if (isCaseSpecific === 'no' && isPp === 'yes') {
        usersCaseContainer.classList.remove('hidden');
        moveUsersCaseAfter(document.getElementById('isPpContainer'));
      } else {
        usersCaseContainer.classList.add('hidden');
      }
  
      // Show/hide Remaining Attorney Fee
      if (hasPaid === 'no') {
        remainingAttorneyFeeContainer.classList.remove('hidden');
      } else {
        remainingAttorneyFeeContainer.classList.add('hidden');
      }
  
      // Show/hide additional fields for EB1A + Premium Processing
      if (isPp === 'yes' && usersCase === 'EB1A') {
        countryOfBirthContainer.classList.remove('hidden');
        priorityDateIsCurrentContainer.classList.remove('hidden');
        anotherPriorityDateContainer.classList.remove('hidden');
        isInsideUSContainer.classList.remove('hidden');
        serviceCenterContainer.classList.remove('hidden');
        processingTimeContainer.classList.remove('hidden');
      } else {
        countryOfBirthContainer.classList.add('hidden');
        priorityDateIsCurrentContainer.classList.add('hidden');
        anotherPriorityDateContainer.classList.add('hidden');
        isInsideUSContainer.classList.add('hidden');
        serviceCenterContainer.classList.add('hidden');
        processingTimeContainer.classList.add('hidden');
      }
  
      // Show/hide Priority Date
      if (anotherPriorityDate === 'yes') {
        priorityDateContainer.classList.remove('hidden');
      } else {
        priorityDateContainer.classList.add('hidden');
      }
  
      // Show/hide H1B Expiring
      if (isInsideUS === 'yes') {
        h1bIsExpiringContainer.classList.remove('hidden');
      } else {
        h1bIsExpiringContainer.classList.add('hidden');
      }
    }
  
    // Attach event listeners
    isCaseSpecificRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
    hasPaidRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
    isPpRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
    anotherPriorityDateRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
    isInsideUSRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
    document.querySelector('select[name="usersCase"]').addEventListener('change', updateVisibility);
  
    // Initial visibility setup
    updateVisibility();
  });
  