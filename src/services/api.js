const API_BASE_URL = process.env.REACT_APP_API_URL;

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ============= QUESTIONS =============
  
  // GET all questions with their answers
  async getQuestions() {
    return this.request('/questions');
  }

  // GET single question (for testing/future use)
  async getQuestion(id) {
    return this.request(`/questions/${id}`);
  }

  // POST new question
  async createQuestion(text) {
    return this.request('/questions', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // PATCH update question text
  async updateQuestion(id, text) {
    return this.request(`/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ text }),
    });
  }

  // DELETE question
  async deleteQuestion(id) {
    return this.request(`/questions/${id}`, {
      method: 'DELETE',
    });
  }

  // PATCH reorder question
  async reorderQuestion(id, order_index) {
    return this.request(`/questions/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ order_index }),
    });
  }

  // ============= ANSWERS =============

  // GET all answers for a question (for testing/future use)
  async getAnswersByQuestion(questionId) {
    return this.request(`/answers/question/${questionId}`);
  }
  
  // POST new answer
  async createAnswer(questionId, text) {
    return this.request('/answers', {
      method: 'POST',
      body: JSON.stringify({ 
        question_id: questionId, 
        text
      }),
    });
  }

  // PATCH update answer text
  async updateAnswer(id, text) {
    return this.request(`/answers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ text }),
    });
  }

  // DELETE answer
  async deleteAnswer(id) {
    return this.request(`/answers/${id}`, {
      method: 'DELETE',
    });
  }

  // PATCH reorder answer
  async reorderAnswer(id, order_index) {
    return this.request(`/answers/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ order_index }),
    });
  }
}

const apiService = new ApiService();
export default apiService;