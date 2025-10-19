import orderRepo from '../repositories/order.repo.js';
import invoiceService from './invoice.service.js';

class OrderService {
  // Tạo đơn hàng từ giỏ hàng
  async createOrderFromCart(userId, orderData) {
    try {
      // Validate order data
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      if (!orderData.shipping_address) {
        throw new Error('Shipping address is required');
      }

      if (!orderData.payment_method) {
        throw new Error('Payment method is required');
      }

      // Calculate total amount
      let itemsTotal = 0;
      const processedItems = orderData.items.map(item => {
        const itemTotal = parseFloat(item.unit_price) * parseInt(item.quantity);
        itemsTotal += itemTotal;
        
        return {
          product_id: item.product_id || item.id,
          product_name: item.product_name || item.name,
          product_image: item.product_image || item.image,
          unit_price: parseFloat(item.unit_price || item.price),
          quantity: parseInt(item.quantity),
          total_price: itemTotal
        };
      });

      const shippingFee = orderData.shipping_fee || 0;
      const discountAmount = orderData.discount_amount || 0;
      const totalAmount = itemsTotal + shippingFee - discountAmount;

      const newOrder = {
        user_id: userId,
        items: processedItems,
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        notes: orderData.notes
      };

      const order = await orderRepo.createOrder(newOrder);
      
      // Tự động tạo hóa đơn cho đơn hàng
      try {
        // Tạo tóm tắt sản phẩm
        const itemsSummary = processedItems.map(item => 
          `${item.product_name} (x${item.quantity})`
        ).join(', ');
        
        const invoiceData = {
          order_id: order.id,
          user_id: userId,
          customer_email: orderData.customer_email || null,
          shipping_address: orderData.shipping_address,
          items_summary: itemsSummary.length > 250 ? itemsSummary.substring(0, 247) + '...' : itemsSummary,
          total_items: processedItems.reduce((sum, item) => sum + item.quantity, 0),
          total_amount: totalAmount,
          discount_amount: discountAmount,
          voucher_code: orderData.voucher_code || null,
          payment_method: orderData.payment_method.toUpperCase(),
          notes: orderData.notes
        };
        
        await invoiceService.createShopOrderInvoice(invoiceData);
        console.log('✅ Đã tạo hóa đơn tự động cho đơn hàng:', order.order_number);
      } catch (invoiceError) {
        console.error('❌ Lỗi khi tạo hóa đơn tự động:', invoiceError.message);
        // Không throw error để không ảnh hưởng đến việc tạo đơn hàng
      }
      
      return {
        success: true,
        data: order,
        message: 'Order created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Lấy đơn hàng của user
  async getUserOrders(userId, filters = {}) {
    try {
      console.log('🔍 getUserOrders called with userId:', userId, 'type:', typeof userId);
      
      const result = await orderRepo.getOrdersByUserId(userId, filters);
      return {
        success: true,
        data: result,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      console.log('❌ getUserOrders error:', error.message);
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetails(orderId, userId = null) {
    try {
      const order = await orderRepo.getOrderById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Nếu có userId, kiểm tra quyền truy cập
      if (userId && order.user_id !== userId) {
        throw new Error('Access denied');
      }

      return {
        success: true,
        data: order,
        message: 'Order details retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get order details: ${error.message}`);
    }
  }

  // Lấy đơn hàng theo order number
  async getOrderByNumber(orderNumber, userId = null) {
    try {
      const order = await orderRepo.getOrderByNumber(orderNumber);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Nếu có userId, kiểm tra quyền truy cập
      if (userId && order.user_id !== userId) {
        throw new Error('Access denied');
      }

      return {
        success: true,
        data: order,
        message: 'Order retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  // Admin: Lấy tất cả đơn hàng
  async getAllOrders(filters = {}) {
    try {
      const result = await orderRepo.getAllOrders(filters);
      return {
        success: true,
        data: result,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId, status, notes = null, userId = null) {
    try {
      // Validate status
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
      }

      // Nếu có userId, kiểm tra quyền (chỉ user có thể cancel)
      if (userId) {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        if (order.user_id !== userId) {
          throw new Error('Access denied');
        }
        if (status !== 'cancelled') {
          throw new Error('Users can only cancel orders');
        }
        if (order.status !== 'pending') {
          throw new Error('Can only cancel pending orders');
        }
      }

      const updatedOrder = await orderRepo.updateOrderStatus(orderId, status, notes);
      return {
        success: true,
        data: updatedOrder,
        message: 'Order status updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validStatuses.includes(paymentStatus)) {
        throw new Error('Invalid payment status');
      }

      const updatedOrder = await orderRepo.updatePaymentStatus(orderId, paymentStatus);
      return {
        success: true,
        data: updatedOrder,
        message: 'Payment status updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  // Thống kê đơn hàng
  async getOrderStatistics() {
    try {
      const stats = await orderRepo.getOrderStats();
      return {
        success: true,
        data: stats,
        message: 'Order statistics retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get order statistics: ${error.message}`);
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId, userId = null) {
    try {
      return await this.updateOrderStatus(orderId, 'cancelled', 'Order cancelled by user', userId);
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }
}

export default new OrderService();