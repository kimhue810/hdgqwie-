"use strict";
// Dữ liệu khởi tạo. Được phép chỉnh sửa hoặc thêm thuộc tính nếu cần.
const items = [
  {
    "id": 1,
    "title": "Viết báo cáo HTML",
    "dueDate": "2026-10-20",
    "priority": "Cao",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Ôn Flexbox",
    "dueDate": "2026-10-23",
    "priority": "Trung bình",
    "status": "pending"
  },
  {
    "id": 3,
    "title": "Làm bài DOM",
    "dueDate": "2026-10-19",
    "priority": "Cao",
    "status": "done"
  },
  {
    "id": 4,
    "title": "Đọc tài liệu CSS",
    "dueDate": "2026-10-25",
    "priority": "Thấp",
    "status": "pending"
  },
  {
    "id": 5,
    "title": "Thiết kế trang cá nhân",
    "dueDate": "2026-10-21",
    "priority": "Trung bình",
    "status": "done"
  }
];

// C1: Viết hàm hiển thị dữ liệu từ mảng lên DOM.
// C2: Viết hàm đọc form, kiểm tra dữ liệu và thêm bản ghi.
// C3: Viết chức năng tìm kiếm và lọc trạng thái.
// C4: Viết chức năng cập nhật trạng thái và xóa theo ID.
// Gợi ý: addEventListener, querySelector, createElement, textContent, filter.
// KHÔNG có lời giải mẫu trong file này.

// Truy xuất các phần tử DOM cần thiết
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');

// C1: Hàm hiển thị dữ liệu từ mảng lên DOM
function renderTasks(dataToRender) {
  // Xóa rỗng danh sách hiện tại trước khi hiển thị lại
  taskList.innerHTML = ''; 

  dataToRender.forEach(item => {
    // Kiểm tra trạng thái để thêm class 'done' (gạch ngang chữ) nếu đã hoàn thành
    const isDone = item.status === 'done';
    
    // Tạo thẻ div chứa công việc
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${isDone ? 'done' : ''}`;
    
    // Đổ nội dung HTML vào thẻ div
    taskDiv.innerHTML = `
      <div class="task-info">
        <h3 class="task-title" style="margin: 0 0 5px 0;">${item.title}</h3>
        <span style="font-size: 14px; color: #555;">
          Hạn: ${item.dueDate || 'Không có'} | Ưu tiên: <strong>${item.priority}</strong>
        </span>
      </div>
      <div class="task-actions">
        <button onclick="toggleStatus(${item.id})">
          ${isDone ? 'Chưa xong' : 'Hoàn thành'}
        </button>
        <button style="background-color: #dc3545;" onclick="deleteTask(${item.id})">Xóa</button>
      </div>
    `;
    
    // Gắn thẻ div vào vùng hiển thị danh sách
    taskList.appendChild(taskDiv);
  });
}

// Gọi hàm lần đầu để hiển thị 5 công việc mẫu
renderTasks(items);


// C3: Chức năng tìm kiếm và lọc trạng thái (Viết hàm này trước để C2 và C4 có thể gọi lại)
function applySearchAndFilter() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filterValue = filterStatus.value;
  
  const filteredItems = items.filter(item => {
    // 1. Lọc theo tên (không phân biệt hoa thường)
    const matchName = item.title.toLowerCase().includes(searchTerm);
    // 2. Lọc theo trạng thái (nếu chọn 'all' thì luôn đúng)
    const matchStatus = filterValue === 'all' || item.status === filterValue;
    
    return matchName && matchStatus;
  });
  
  // Hiển thị mảng đã được lọc
  renderTasks(filteredItems);
}

// Lắng nghe sự kiện gõ phím vào ô tìm kiếm và thay đổi dropdown lọc
searchInput.addEventListener('input', applySearchAndFilter);
filterStatus.addEventListener('change', applySearchAndFilter);


// C2: Đọc form, kiểm tra dữ liệu và thêm bản ghi
taskForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Ngăn chặn hành vi tải lại trang mặc định của form
  
  const titleInput = document.getElementById('task-name');
  const dateInput = document.getElementById('task-date');
  const priorityInput = document.getElementById('task-priority');
  
  // Kiểm tra tên rỗng (mặc dù đã có 'required' bên HTML, nhưng thêm ở JS cho chắc chắn)
  if (titleInput.value.trim() === '') {
    alert("Tên công việc không được để trống!");
    return;
  }
  
  // Tạo đối tượng công việc mới
  const newTask = {
    id: Date.now(), // Dùng thời gian hiện tại làm ID duy nhất
    title: titleInput.value.trim(),
    dueDate: dateInput.value,
    priority: priorityInput.value,
    status: 'pending' // Mặc định khi mới thêm là chưa hoàn thành
  };
  
  // Đẩy vào mảng items gốc (do items là const, ta không thể gán lại bằng dấu =, nhưng dùng .push() thì được phép)
  items.push(newTask);
  
  // Cập nhật lại giao diện (dùng hàm này để nếu đang tìm kiếm/lọc thì nó vẫn giữ nguyên bộ lọc)
  applySearchAndFilter();
  
  // Xóa trắng dữ liệu trong form sau khi thêm thành công
  taskForm.reset(); 
});


// C4: Cập nhật trạng thái và xóa theo ID (Được gọi từ thuộc tính onclick của các nút bấm)

// Cập nhật trạng thái
function toggleStatus(id) {
  // Tìm công việc có id tương ứng
  const task = items.find(item => item.id === id);
  if (task) {
    // Đảo ngược trạng thái
    task.status = task.status === 'pending' ? 'done' : 'pending';
    // Cập nhật giao diện
    applySearchAndFilter(); 
  }
}

// Xóa công việc
function deleteTask(id) {
  // Xác nhận trước khi xóa (bạn có thể bỏ dòng này nếu không cần)
  if (!confirm("Bạn có chắc chắn muốn xóa công việc này?")) return;
  
  // Tìm vị trí (index) của công việc trong mảng
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    // Xóa 1 phần tử tại vị trí index
    items.splice(index, 1);
    // Cập nhật giao diện
    applySearchAndFilter();
  }
}