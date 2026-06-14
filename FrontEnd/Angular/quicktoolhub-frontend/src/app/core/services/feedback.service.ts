import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FeedbackPayload, FeedbackResponse } from '../models/feedback.model';

const ANONYMOUS_USER_ID_KEY = 'qth_anonymous_user_id';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly http = inject(HttpClient);

  getAnonymousUserId(): string {
    const existing = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
    if (existing) {
      return existing;
    }

    const id = `qth_anon_${crypto.randomUUID ? crypto.randomUUID() : this.fallbackId()}`;
    localStorage.setItem(ANONYMOUS_USER_ID_KEY, id);
    return id;
  }

  submitFeedback(payload: Omit<FeedbackPayload, 'anonymousUserId'>): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${environment.apiUrl}/feedback`, {
      ...payload,
      anonymousUserId: this.getAnonymousUserId(),
    });
  }

  private fallbackId(): string {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}
