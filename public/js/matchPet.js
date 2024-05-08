function matchesCriteria(pet, criteria) {
    // Check if pet type matches (if specified)
    if (criteria.petType && criteria.petType !== pet.petType) {
        return false;
    }
    
    // Check if breed matches (if specified and not 'any')
    if (criteria.breed && criteria.breed !== 'any' && criteria.breed !== pet.breed) {
        return false;
    }
    
    // Check if age range matches (if specified and not 'any')
    if (criteria.age && criteria.age !== 'any' && criteria.age!==pet.age) {
        return false;
    }
    
    // Check if gender matches (if specified and not 'any')
    if (criteria.gender && criteria.gender !== 'any' && criteria.gender !== pet.gender) {
        return false;
    }

    // Check other checkboxes for compatibility
    if (criteria.otherDogs && !pet.getsAlongWithDogs) {
        return false;
    }
    if (criteria.otherCats && !pet.getsAlongWithCats) {
        return false;
    }
    if (criteria.smallChildren && !pet.goodWithChildren) {
        return false;
    }

    // If all checks passed, the pet matches the criteria
    return true;
}


