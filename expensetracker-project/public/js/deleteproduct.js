function deleteItem(itemId, category) {
  const confirmation = confirm("Are you sure you want to delete this item?");
   console.log('id.......',itemId)
  if (confirmation) {
    axios
      .post("/product/deleteProduct", { itemId })
      .then((response) => {
        if (response.data.success) {
          const listItem = document.getElementById(`${category}-${itemId}`);
          listItem.parentNode.removeChild(listItem);
        } else {
          alert("Failed to delete item.");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  }
}


async function fetchProducts() {
  const response = await fetch(`http://localhost:3000/product/addProduct/${userid}`);
  const data = await response.json();
  const expenses = data.expenses;

  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  expenses.forEach(expense => {
      const deleteButton = `<button onclick="deleteProduct(${expense.id})">Delete</button>`;
      productList.innerHTML += `<div>${expense.amount}-${expense.description} - ${expense.category} ${deleteButton}</div>`;
  });
}

async function deleteProduct(itemId) {
  const response = await fetch('http://localhost:3000/product/deleteProduct', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
  });

  if (response.ok) {
      fetchProducts(); 
  } else {
      console.error('Failed to delete product');
  }
}


fetchProducts();
