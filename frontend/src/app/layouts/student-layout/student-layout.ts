import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentSidebar } from './components/student-sidebar/student-sidebar';
import { Topbar } from '../../components/topbar/topbar';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [RouterOutlet, StudentSidebar, Topbar],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss'
})
export class StudentLayout {}
