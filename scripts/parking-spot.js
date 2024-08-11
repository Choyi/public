function basicConfigSubmit(event) {
  event.preventDefault()

  const maxCheckInterval = Number(document.getElementById('max-check-interval').value)

  fetch('/api/config/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ maxCheckInterval }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 0) {
        // Successfully saved
        console.log('Configuration saved successfully')
      } else {
        console.error('Error:', data.msg)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function onAddrDeleteClick(macAddress, button) {
  if (confirm('确认删除？')) {
    deleteMacAddress(macAddress, button)
  }
}

function deleteMacAddress(macAddress, button) {
  fetch('/api/config/addr/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ macAddress }),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.code) {
        console.error('Error:', resp.msg)
        return
      }
      button.parentElement.remove()
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function addMacAddressItemElements(macAddressList) {
  const macListElem = document.getElementById('mac-list')
  macAddressList.forEach((macAddress) => {
    const macItem = document.createElement('div')
    macItem.className = 'mac-item d-flex justify-content-between align-items-center'
    macItem.innerHTML = `
      <h5 class="mac-item-title">${macAddress}</h5>
      <button class="btn" onclick="onAddrDeleteClick('${macAddress}', this)">
        <h4 class="mac-item-trash"><i class="bi bi-trash3 text-danger"></i></h4>
      </button>
    `
    macListElem.appendChild(macItem)
  })
}

function macAddressAdding(event) {
  event.preventDefault()

  const macAddress = document.getElementById('mac-address').value.toLowerCase()

  fetch('/api/config/addr/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ macAddress }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 0) {
        // Successfully added
        addMacAddressItemElements([macAddress])
        // Close the modal
        $('#addMacModal').modal('hide')
        // Clear the input field
        document.getElementById('mac-address').value = ''
      } else {
        console.error('Error:', data.msg)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function makeBodyWrap() {
  document.getElementById('body-wrap').innerHTML = `
    <div class="container mt-4">
      <div class="card mb-4">
        <div class="card-body">
          <h3 class="card-title">Basic Config</h3>
          <form id="basicConfigForm">
            <div class="form-group">
              <label for="max-check-interval">Max Check Interval (seconds):</label>
              <input
                type="number"
                class="form-control"
                id="max-check-interval"
                name="maxCheckInterval"
                min="1"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0">MAC Address List</h3>
          <button class="btn" data-toggle="modal" data-target="#addMacModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#007bff"
              class="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
              />
            </svg>
          </button>
        </div>
        <div id="mac-list">
          <!-- List items will be dynamically added here -->
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="addMacModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addMacModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addMacModalLabel">Add MAC Address</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="addMacForm">
              <div class="form-group">
                <label for="mac-address">MAC Address:</label>
                <input type="text" class="form-control" id="mac-address" required />
              </div>
              <button type="submit" class="btn btn-primary" id="addAddressButton">Add Address</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
}

window.onload = async () => {
  makeBodyWrap()

  document.getElementById('basicConfigForm').addEventListener('submit', basicConfigSubmit)
  document.getElementById('addMacForm').addEventListener('submit', macAddressAdding)

  const macAddressInput = document.getElementById('mac-address')
  const addAddressButton = document.getElementById('addAddressButton')

  const checkInput = () => {
    addAddressButton.disabled = macAddressInput.value.trim() === ''
  }

  macAddressInput.addEventListener('input', checkInput)
  checkInput()

  try {
    const response = await fetch('/api/config')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()

    // Display maxCheckInterval
    const maxCheckIntervalElem = document.getElementById('max-check-interval')
    maxCheckIntervalElem.value = data.res.maxCheckInterval

    // Display MAC addresses
    addMacAddressItemElements(data.res.addrs)
  } catch (error) {
    console.error('Error fetching configuration:', error)
  }
}
