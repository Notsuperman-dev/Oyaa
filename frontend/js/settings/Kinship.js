document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('kinshipForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const kinshipData = {
            subscriptionType: formData.get('subscriptionType'),
            paymentDetails: formData.get('paymentDetails')
        };

        localStorage.setItem('kinshipData', JSON.stringify(kinshipData));

        alert('Subscription details saved successfully!');
    });

    const savedKinshipData = JSON.parse(localStorage.getItem('kinshipData'));

    if (savedKinshipData) {
        document.getElementById('subscriptionType').value = savedKinshipData.subscriptionType;
        document.getElementById('paymentDetails').value = savedKinshipData.paymentDetails;
    }
});
