class DogAPIViewer {
    constructor() {
        this.apiBaseUrl = 'https://dog.ceo/api';
        this.dogGrid = document.getElementById('dogGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.imageCount = document.getElementById('imageCount');
        this.breedSearch = document.getElementById('breedSearch');
        this.searchBtn = document.getElementById('searchBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        
        this.currentImages = [];
        this.allBreeds = [];
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadAllBreeds();
        await this.loadRandomDogs();
    }
    
    setupEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchBreed());
        this.refreshBtn.addEventListener('click', () => this.loadRandomDogs());
        
        this.breedSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBreed();
            }
        });
        
        // Add input event for real-time suggestions
        this.breedSearch.addEventListener('input', (e) => {
            this.showBreedSuggestions(e.target.value);
        });
    }
    
    async loadAllBreeds() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/breeds/list/all`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.allBreeds = Object.keys(data.message);
            }
        } catch (error) {
            console.error('Error loading breeds:', error);
        }
    }
    
    showBreedSuggestions(input) {
        if (!input) return;
        
        const suggestions = this.allBreeds.filter(breed => 
            breed.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);
        
        // You could implement a dropdown here for better UX
        console.log('Breed suggestions:', suggestions);
    }
    
    async loadRandomDogs(count = 8) {
        this.showLoading(true);
        this.hideError();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/breeds/image/random/${count}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.currentImages = data.message.map((url, index) => ({
                    id: index + 1,
                    url: url,
                    breed: this.extractBreedFromUrl(url)
                }));
                
                this.displayDogs(this.currentImages);
                this.updateImageCount(this.currentImages.length);
            } else {
                throw new Error('Failed to fetch random dogs');
            }
        } catch (error) {
            console.error('Error loading random dogs:', error);
            this.showError();
        } finally {
            this.showLoading(false);
        }
    }
    
    async searchBreed() {
        const breedInput = this.breedSearch.value.trim().toLowerCase();
        
        if (!breedInput) {
            alert('Please enter a breed name to search');
            return;
        }
        
        // Find matching breed
        const matchingBreed = this.allBreeds.find(breed => 
            breed.toLowerCase().includes(breedInput)
        );
        
        if (!matchingBreed) {
            alert(`Breed "${breedInput}" not found. Try breeds like: golden, bulldog, husky, poodle`);
            return;
        }
        
        this.showLoading(true);
        this.hideError();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/breed/${matchingBreed}/images`);
            const data = await response.json();
            
            if (data.status === 'success') {
                // Get random 8 images from the breed
                const shuffled = data.message.sort(() => 0.5 - Math.random());
                const selectedImages = shuffled.slice(0, 8);
                
                this.currentImages = selectedImages.map((url, index) => ({
                    id: index + 1,
                    url: url,
                    breed: matchingBreed
                }));
                
                this.displayDogs(this.currentImages);
                this.updateImageCount(this.currentImages.length, matchingBreed);
            } else {
                throw new Error(`No images found for breed: ${matchingBreed}`);
            }
        } catch (error) {
            console.error('Error searching breed:', error);
            this.showError(`Error finding images for "${breedInput}". Please try another breed.`);
        } finally {
            this.showLoading(false);
        }
    }
    
    extractBreedFromUrl(url) {
        // Extract breed name from URL like: https://images.dog.ceo/breeds/hound-afghan/n02088094_1007.jpg
        const parts = url.split('/');
        const breedPart = parts[4]; // breeds/hound-afghan
        if (breedPart) {
            return breedPart.replace('-', ' ');
        }
        return 'Unknown';
    }
    
    displayDogs(dogs) {
        this.dogGrid.innerHTML = '';
        
        dogs.forEach((dog, index) => {
            const dogCard = this.createDogCard(dog, index);
            this.dogGrid.appendChild(dogCard);
        });
    }
    
    createDogCard(dog, index) {
        const card = document.createElement('div');
        card.className = 'dog-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${dog.url}" alt="${dog.breed} dog" loading="lazy" onerror="this.src='/placeholder.svg?height=250&width=280'">
            <div class="dog-info">
                <div class="dog-breed">${dog.breed}</div>
                <div class="dog-id">Dog #${dog.id}</div>
            </div>
        `;
        
        return card;
    }
    
    updateImageCount(count, breed = null) {
        if (breed) {
            this.imageCount.textContent = `Showing ${count} ${breed} dogs`;
        } else {
            this.imageCount.textContent = `Showing ${count} random dogs`;
        }
    }
    
    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'flex' : 'none';
    }
    
    showError(message = null) {
        if (message) {
            this.errorMessage.querySelector('p').textContent = message;
        }
        this.errorMessage.classList.remove('hidden');
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DogAPIViewer();
});
