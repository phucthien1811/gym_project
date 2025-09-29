import React from 'react';

const MemberPackages = () => {
  // Fake data
  const currentPackage = {
    name: "Gói Gold",
    description: "Gói tập không giới hạn thời gian",
    daysLeft: 25,
    expireDate: "21/10/2025",
    benefits: [
      "Tập luyện không giới hạn thời gian",
      "Tham gia tất cả các lớp học nhóm",
      "Sử dụng phòng xông hơi",
      "Tủ đồ cá nhân",
      "2 buổi PT miễn phí/tháng"
    ]
  };

  const packageHistory = [
    {
      name: "Gói Gold",
      startDate: "01/09/2025",
      endDate: "21/10/2025",
      status: "active"
    },
    {
      name: "Gói Silver",
      startDate: "01/06/2025",
      endDate: "31/08/2025",
      status: "expired"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Gói tập của tôi</h2>

      {/* Current Package */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">{currentPackage.name}</h3>
            <p className="opacity-90">{currentPackage.description}</p>
            <div className="mt-4">
              <div className="text-sm opacity-90">Thời hạn còn lại</div>
              <div className="text-3xl font-bold">{currentPackage.daysLeft} ngày</div>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Gia Hạn
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-blue-400">
          <h4 className="font-medium mb-3">Quyền lợi gói tập:</h4>
          <ul className="space-y-2 text-sm">
            {currentPackage.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Package History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Lịch sử gói tập</h3>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packageHistory.map((pkg, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.startDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pkg.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.status === 'active' ? 'Đang sử dụng' : 'Đã hết hạn'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberPackages;