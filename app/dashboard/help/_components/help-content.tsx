"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen, 
  Settings, 
  Users, 
  FolderGit2, 
  CheckCircle, 
  Briefcase, 
  Layers, 
  Mail, 
  Database,
  Eye,
  Plus,
  Edit,
  Upload,
  ExternalLink,
  Lightbulb,
  Star,
  Target,
  Zap,
  MailIcon,
} from "lucide-react"
import Link from "next/link"

export function HelpContent() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Portfolio Help Center
        </h1>
        <p className="text-muted-foreground">
          Complete guide to mastering your professional portfolio dashboard
        </p>
      </div>

      {/* Quick Start Section */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Get your portfolio up and running in 5 steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600">1</Badge>
              <span>Set up your admin profile with photo and details</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600">2</Badge>
              <span>Add your first project with screenshots and details</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600">3</Badge>
              <span>Upload your technical skills and certifications</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600">4</Badge>
              <span>Document your work experience and achievements</span>
            </div>
            <div className="flex items-center gap-3">
                <Badge className="bg-green-600">5</Badge>
               <span>Configure site settings, contact information, and (required for contact form emails) Contact SMTP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Admin Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Profile
            </CardTitle>
            <CardDescription>
              Manage your personal information and social links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                What to add:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Professional photo and name</li>
                <li>• Current position and location</li>
                <li>• Introduction and bio</li>
                <li>• Education background</li>
                <li>• Skills and expertise</li>
                <li>• Social media handles (@username format)</li>
              </ul>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/manage-admin">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Projects Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 className="h-5 w-5" />
              Projects
            </CardTitle>
            <CardDescription>
              Showcase your best work and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Pro Tips:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Add at least 4 projects for parallax effect</li>
                <li>• Include live demo and GitHub links</li>
                <li>• Upload high-quality screenshots</li>
                <li>• Use descriptive titles and clear descriptions</li>
                <li>• Highlight technologies used</li>
              </ul>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/manage-projects">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Certifications
            </CardTitle>
            <CardDescription>
              Display your professional credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How to add:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Certification title and organization</li>
                <li>• Completion date and credential ID</li>
                <li>• Certificate URL for verification</li>
                <li>• Upload certificate screenshot</li>
                <li>• List what you learned (skills/topics)</li>
              </ul>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/manage-certifications">
                <Upload className="h-4 w-4 mr-2" />
                Add Certification
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </CardTitle>
            <CardDescription>
              Document your professional journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Include details about:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Job title, company, and location</li>
                <li>• Employment dates and work mode</li>
                <li>• Key responsibilities and achievements</li>
                <li>• Skills and technologies learned</li>
                <li>• Use "Currently Working" for present jobs</li>
              </ul>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/manage-experience">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Tech Stack
            </CardTitle>
            <CardDescription>
              Highlight your technical expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Categories available:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Skills</Badge>
                <Badge variant="secondary">Dev Tools</Badge>
                <Badge variant="secondary">Platforms</Badge>
                <Badge variant="secondary">Multimedia</Badge>
                <Badge variant="secondary">System</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload technology logos and provide official URLs for each tool
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/manage-techstack">
                <Plus className="h-4 w-4 mr-2" />
                Add Technology
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Site Settings
            </CardTitle>
            <CardDescription>
              Customize your portfolio experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Custom Cursor Magic:
              </h4>
              <p className="text-sm text-muted-foreground">
                Enable an interactive custom cursor that morphs into a stylish hand pointer when hovering over clickable elements - creating a premium feel that impresses visitors!
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/site-settings">
                <Settings className="h-4 w-4 mr-2" />
                Configure Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Portfolio Best Practices
          </CardTitle>
          <CardDescription>
            Tips to make your portfolio stand out
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600 dark:text-green-400">✅ Do's</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Keep project descriptions clear and concise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use high-quality images and screenshots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Include live demo links when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Regular updates with new projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use professional social media links</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-red-600 dark:text-red-400">❌ Don'ts</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Don't use low-resolution images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Avoid broken or inactive links</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Don't leave sections empty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Avoid outdated information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Don't forget to test all functionality</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Technical Setup & Troubleshooting
          </CardTitle>
          <CardDescription>
            Configuration and common issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Required Services:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• MongoDB Database</li>
                <li>• Cloudinary (Image Storage)</li>
                <li>• Clerk (Authentication)</li>
                <li>• Contact SMTP (Contact form email sending) — configure in <strong>/dashboard/manage-contact-smtp</strong></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Key Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Responsive Design</li>
                <li>• Admin Dashboard</li>
                <li>• Image Upload System</li>
                <li>• Contact Form Integration</li>
                <li>• SEO Optimized</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The parallax effect on your homepage activates automatically after adding at least 4 projects. 
              This creates a stunning visual experience for your visitors!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
        <CardHeader>
          <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Need More Help?
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Additional resources and support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            If you encounter any issues or need assistance with setup, feel free to reach out for help.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/reblox01/Portfolio" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Documentation
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <Eye className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://sohailkoutari.com/contact" target="_blank" rel="noopener noreferrer">
                <MailIcon className="h-4 w-4 mr-2" />
                Contact Developer
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
