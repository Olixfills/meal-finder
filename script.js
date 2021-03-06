const submit = document.getElementById('submit'),
    search = document.getElementById('search'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    singleMealEl = document.getElementById('single-meal');

//Search Meal

function searchMeal(e) {
    e.preventDefault();

    //clear single meal 
    singleMealEl.innerHTML = '';

    //get search term
    const term = search.value;

    //confirm against empty strings

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.meals);

                resultHeading.innerHTML = `<h2>Search Results for ${term}</h2>`

                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>So sorry, we have no meals that fit the description: '${term}'</h2>`

                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `)
                    .join('');

                    //clear search
                    search.value = '';
                }


            })
            .catch(err => {
                console.error(err);
            });


    } else {
        alert('Please enter a valid meal name or try random')
    };

}


//Fetch meals by ID

function getMealByID(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]

            addMealToDOM(meal)
        })
}

//random meal

function getRandomMeal(){
    // clear meals and headings
    mealsEl.innerHTML = ''
    resultHeading.innerHTML = ''


    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {

            const meal = data.meals[0]

            addMealToDOM(meal);
        })

}


//Add meal to the DOM

function addMealToDOM(meal){
    const ingredients = []

    for (let i = 1; i <= 20; i++){
        if( meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else{
            break;
        }
    }

    singleMealEl.innerHTML = `<div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
  
    <div class="main">
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
      <p>
        ${meal.strInstructions}
      </p>
      
    </div>
  
  </div>`

}


//Event Listeners

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList){
            return item.classList.contains('meal-info');
        } else{
            return false
        }
    })

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
        // console.log(mealID)
    }


})