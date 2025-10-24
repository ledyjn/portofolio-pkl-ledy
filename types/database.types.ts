export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          detail: string
          technologies: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          detail: string
          technologies?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          detail?: string
          technologies?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
