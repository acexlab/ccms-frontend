import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CaseService } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-court-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './court-case-detail.component.html',
  styleUrls: ['./court-case-detail.component.scss']
})
export class CourtCaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly caseService = inject(CaseService);
  private readonly authService = inject(AuthService);

  apiUrl = environment.apiUrl.replace('/api', ''); // Base server URL for file downloads

  caseId!: number;
  caseDetails: any = null;
  isLoading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.caseId = parseInt(idParam, 10);
      this.loadCaseDetails();
    }
  }

  loadCaseDetails(): void {
    this.isLoading = true;
    this.caseService.getCaseById(this.caseId).subscribe({
      next: (data) => {
        this.caseDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load case details', err);
        this.isLoading = false;
      }
    });
  }

  isFreezeOrder(): boolean {
    return this.caseDetails?.case?.orderType === 'FreezeAccount' || this.caseDetails?.case?.orderType === 0;
  }

  getDownloadUrl(filePath: string): string {
    if (!filePath) return '#';
    if (filePath.startsWith('/')) {
      return `${this.apiUrl}${filePath}`;
    }
    return filePath;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}