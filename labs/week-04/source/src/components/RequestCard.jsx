function RequestCard({ request, onDeleteRequest }) {
  const statusLabels = {
    pending: 'รอดำเนินการ',
    'in-progress': 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
  };

  const priorityLabels = {
    normal: 'ปกติ',
    urgent: 'เร่งด่วน',
  };

  return (
    <article className="request-card">
      <div>
        <div className="card-header-meta">
          <span className="request-id">{request.id}</span>
          <span className={`badge status-${request.status}`}>
            {statusLabels[request.status] || request.status}
          </span>
          {request.priority === 'urgent' && (
            <span className="badge priority-urgent">
              {priorityLabels[request.priority]}
            </span>
          )}
        </div>
        <h3>{request.requestType}</h3>
        <p className="request-requester"><strong>ผู้แจ้ง:</strong> {request.requesterName}</p>
        <p className="request-location"><strong>สถานที่:</strong> {request.location}</p>
        <p className="request-details">{request.details}</p>
      </div>
      <button type="button" onClick={() => onDeleteRequest(request.id)}>
        ลบ
      </button>
    </article>
  );
}

export default RequestCard;


