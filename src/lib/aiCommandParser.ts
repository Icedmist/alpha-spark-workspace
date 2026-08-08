import { AICommandParseResult, TaskStatus, TaskPriority, TaskCategory, Task, User, Directorate } from '../types';

export class AICommandParser {
  static parseLocalCommand(
    command: string,
    users: User[],
    directorates: Directorate[],
    existingTasks: Task[]
  ): AICommandParseResult {
    const cmdLower = command.toLowerCase().trim();

    // 1. Filter Overdue
    if (cmdLower.includes('overdue') || cmdLower.includes('late tasks')) {
      return {
        intent: 'filter_overdue',
        naturalLanguageCommand: command,
        explanation: 'Filtered view for overdue tasks needing urgent directorate attention.',
      };
    }

    // 2. Generate Report
    if (cmdLower.includes('report') || cmdLower.includes('summary') || cmdLower.includes('analytics')) {
      return {
        intent: 'generate_report',
        naturalLanguageCommand: command,
        timeframe: cmdLower.includes('month') ? 'monthly' : 'weekly',
        explanation: 'Generating automated executive performance report with directorate throughput charts.',
      };
    }

    // 3. Mark / Update Task Status ("Mark the course catalog as completed")
    if (cmdLower.startsWith('mark') || cmdLower.includes('complete') || cmdLower.includes('in progress')) {
      let targetStatus: TaskStatus = 'completed';
      if (cmdLower.includes('in progress') || cmdLower.includes('started')) targetStatus = 'in_progress';
      if (cmdLower.includes('review')) targetStatus = 'review';
      if (cmdLower.includes('todo') || cmdLower.includes('to do')) targetStatus = 'todo';

      // Find matching task
      const matchedTask = existingTasks.find((t) => {
        const titleWords = t.title.toLowerCase().split(' ');
        return titleWords.some((w) => w.length > 3 && cmdLower.includes(w));
      });

      return {
        intent: 'update_status',
        naturalLanguageCommand: command,
        targetTaskTitle: matchedTask ? matchedTask.title : command,
        updatedTaskId: matchedTask?.id,
        newStatus: targetStatus,
        explanation: matchedTask
          ? `Updated task "${matchedTask.title}" status to ${targetStatus.replace('_', ' ')}.`
          : `Marked matching task status as ${targetStatus.replace('_', ' ')}.`,
      };
    }

    // 4. Create / Assign Task ("Assign Fatima to teach Machine Learning tomorrow at 4 PM" or "Ask Amina to design flyer by Friday")
    const isAssign = cmdLower.includes('assign') || cmdLower.includes('ask') || cmdLower.includes('schedule') || cmdLower.includes('create');

    // Extract potential user names
    const matchedUsers = users.filter((u) => {
      const nameFirst = u.displayName.split(' ')[0].toLowerCase();
      return cmdLower.includes(nameFirst);
    });

    // Detect Directorate / Category
    let category: TaskCategory = 'custom';
    let directorateId = directorates[0]?.id || 'dir-dev';

    if (cmdLower.includes('teach') || cmdLower.includes('lecture') || cmdLower.includes('student') || cmdLower.includes('course')) {
      category = 'teaching';
      const eduDir = directorates.find((d) => d.code === 'EDU');
      if (eduDir) directorateId = eduDir.id;
    } else if (cmdLower.includes('design') || cmdLower.includes('flyer') || cmdLower.includes('banner') || cmdLower.includes('logo')) {
      category = 'graphic_design';
      const dsgDir = directorates.find((d) => d.code === 'DSG');
      if (dsgDir) directorateId = dsgDir.id;
    } else if (cmdLower.includes('audit') || cmdLower.includes('finance') || cmdLower.includes('budget') || cmdLower.includes('payroll')) {
      category = 'finance';
      const finDir = directorates.find((d) => d.code === 'FIN');
      if (finDir) directorateId = finDir.id;
    } else if (cmdLower.includes('procure') || cmdLower.includes('laptop') || cmdLower.includes('hardware')) {
      category = 'procurement';
      const opsDir = directorates.find((d) => d.code === 'OPS');
      if (opsDir) directorateId = opsDir.id;
    } else if (cmdLower.includes('dev') || cmdLower.includes('code') || cmdLower.includes('api') || cmdLower.includes('bug')) {
      category = 'software_dev';
      const devDir = directorates.find((d) => d.code === 'DEV');
      if (devDir) directorateId = devDir.id;
    }

    // Detect Priority
    let priority: TaskPriority = 'medium';
    if (cmdLower.includes('urgent') || cmdLower.includes('asap')) priority = 'urgent';
    else if (cmdLower.includes('high') || cmdLower.includes('important')) priority = 'high';
    else if (cmdLower.includes('low')) priority = 'low';

    // Calculate Due Date
    let dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Default tomorrow
    if (cmdLower.includes('friday')) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const distanceToFriday = (5 - dayOfWeek + 7) % 7 || 7;
      dueDate = new Date(today.setDate(today.getDate() + distanceToFriday)).toISOString();
    } else if (cmdLower.includes('today')) {
      dueDate = new Date().toISOString();
    }

    // Clean task title
    let taskTitle = command
      .replace(/^(assign|ask|schedule|create|please)\s+/i, '')
      .replace(/\s+(by|for|at|tomorrow|today|friday).*$/i, '');
    taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);

    return {
      intent: 'create_task',
      naturalLanguageCommand: command,
      extractedTask: {
        title: taskTitle,
        description: `Auto-generated task from natural language command: "${command}".`,
        category,
        directorateId,
        assigneeIds: matchedUsers.map((u) => u.id),
        assigneeNames: matchedUsers.map((u) => u.displayName),
        priority,
        status: 'todo',
        dueDate,
        subtasks: [
          { id: `st-${Date.now()}-1`, title: 'Initial prep & kickoff', completed: false },
          { id: `st-${Date.now()}-2`, title: 'Deliver result to directorate lead', completed: false },
        ],
        tags: [category.replace('_', ' '), 'AI Created'],
      },
      explanation: `AI extracted new task "${taskTitle}" assigned to ${
        matchedUsers.map((u) => u.displayName).join(', ') || 'Team'
      } due on ${new Date(dueDate).toLocaleDateString()}.`,
    };
  }

  static async parseCommandWithAI(
    command: string,
    users: User[],
    directorates: Directorate[],
    existingTasks: Task[]
  ): Promise<AICommandParseResult> {
    try {
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, users, directorates, existingTasks }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.result) return data.result;
      }
    } catch (e) {
      console.warn('AI API call failed, using intelligent fallback parser:', e);
    }

    // Fallback parser if API endpoint isn't ready or offline
    return this.parseLocalCommand(command, users, directorates, existingTasks);
  }
}
